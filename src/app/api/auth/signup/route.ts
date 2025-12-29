import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getPrisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('Signup request received');
    const { email, password, name } = await request.json();
    console.log('Parsed data:', { email, password: '***', name });

    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const prisma = getPrisma();
    console.log('Prisma client created');

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    console.log('Existing user check:', existingUser ? 'exists' : 'not exists');

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    console.log('Hashing password');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed');

    // Create user
    console.log('Creating user');
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    console.log('User created:', user.id);

    return NextResponse.json({ message: 'User created successfully', user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}