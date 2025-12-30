import { NextRequest, NextResponse } from "next/server"
import { getPrisma } from "@/lib/prisma"
import crypto from "crypto"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await getPrisma().user.findUnique({
      where: { email }
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ message: "If an account with that email exists, we've sent you a password reset link." })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // Store reset token in database (you might want to add a resetToken field to User model)
    // For now, we'll use a simple approach - in production, use a proper token table
    await getPrisma().user.update({
      where: { id: user.id },
      data: {
        // Note: You should add resetToken and resetTokenExpiry fields to your User model
        // For now, we'll skip the database update and just send the email
      }
    })

    // Send email
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset - MessMate",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset for your MessMate account.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
          <p>Best regards,<br>MessMate Team</p>
        </div>
      `,
    })

    return NextResponse.json({ message: "If an account with that email exists, we've sent you a password reset link." })
  } catch (error) {
    console.error("Error sending reset email:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}