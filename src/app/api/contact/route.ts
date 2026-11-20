import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const formData = await req.formData().catch(() => null);
    // Can handle both FormData and JSON
    let name = '';
    let phone = '';
    let message = '';

    if (formData) {
      name = formData.get('name')?.toString() || '';
      phone = formData.get('phone')?.toString() || '';
      message = formData.get('message')?.toString() || '';
    } else {
      const json = await req.json().catch(() => ({}));
      name = json.name || '';
      phone = json.phone || '';
      message = json.message || '';
    }

    await prisma.auditLog.create({
      data: {
        action: 'CONTACT_FORM_SUBMITTED',
        entity: 'Contact',
        details: JSON.stringify({ name, phone, message }),
      },
    }).catch(() => {});

    // Redirect or return success
    return NextResponse.redirect(new URL('/kontak?success=true', req.url));
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengirim pesan.' }, { status: 500 });
  }
}
