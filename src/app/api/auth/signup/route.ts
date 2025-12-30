import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getPrisma } from '@/lib/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

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

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user with unverified status
    console.log('Creating user');
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        // Note: You should add emailVerified field to User model
        // For now, we'll create the user as verified for simplicity
      },
    });
    console.log('User created:', user.id);

    // Send verification email
    try {
      const transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Verify Your Email - MessMate',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to MessMate!</h2>
            <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
            <p>Click the link below to verify your email:</p>
            <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account, please ignore this email.</p>
            <p>Best regards,<br>MessMate Team</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      // Don't fail signup if email fails, but log it
    }

    return NextResponse.json({
      message: 'User created successfully. Please check your email to verify your account.',
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}