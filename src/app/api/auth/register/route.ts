import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signSessionToken, setSessionCookie } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { recordRequestHit } from '@/lib/costProtection';
import { Role, UserStatus } from '@prisma/client';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Nama lengkap minimal 2 karakter.'),
  email: z.string().email('Format email tidak valid.'),
  phone: z.string().min(8, 'Nomor telepon/WhatsApp minimal 8 digit.'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter.'),
});

export async function POST(req: Request) {
  try {
    recordRequestHit();
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`register:${ip}`, { limit: 3, windowMs: 10 * 60 * 1000 });

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Batas pendaftaran tercapai untuk sesi ini. Silakan coba kembali dalam 10 menit.' },
        { status: 429 }
      );
    }
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || 'Data pendaftaran tidak valid.' },
        { status: 400 }
      );
    }

    const { name, email, phone, password } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name,
        phone,
        role: Role.CUSTOMER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      },
    });

    const token = await signSessionToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    await setSessionCookie(token);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: newUser.id,
        action: 'USER_REGISTER',
        entity: 'User',
        entityId: newUser.id,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem internal.' },
      { status: 500 }
    );
  }
}
