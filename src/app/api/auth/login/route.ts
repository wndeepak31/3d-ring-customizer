import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

    if (password === adminPassword) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-admin-key-2026');
      
      const token = await new SignJWT({ role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(secret);

      const proto = req.headers.get('x-forwarded-proto');
      const isHttps = req.url.startsWith('https://') || proto === 'https';

      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: isHttps,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
