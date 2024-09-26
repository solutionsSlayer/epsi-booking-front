import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.json();
  const { identifier, password } = body;

  try {
    const response = await fetch('http://127.0.0.1:1337/api/auth/local', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error.message }, { status: response.status });
    }

    const data = await response.json();

    if (data.jwt && data.user) {
      cookies().set('isAuthenticated', 'true', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return NextResponse.json({ success: true, user: data.user });
    } else {
      return NextResponse.json({ error: 'Invalid login data' }, { status: 400 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 });
  }
}