import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, signSessionToken, setSessionCookie } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { recordRequestHit } from '@/lib/costProtection';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    recordRequestHit();
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`login:${ip}`, { limit: 5, windowMs: 5 * 60 * 1000 });

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Terlalu banyak percobaan masuk. Silakan coba kembali dalam 5 menit.' },
        { status: 429 }
      );
    }
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Email atau password tidak valid.' },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Email atau kata sandi salah.' },
        { status: 401 }
      );
    }

    if (user.status === 'SUSPENDED') {
      return NextResponse.json(
        { error: 'Akun Anda telah dinonaktifkan oleh Administrator.' },
        { status: 403 }
      );
    }

    const passwordMatch = await comparePassword(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Email atau kata sandi salah.' },
        { status: 401 }
      );
    }

    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await setSessionCookie(token);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        entity: 'User',
        entityId: user.id,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem internal.' },
      { status: 500 }
    );
  }
}
