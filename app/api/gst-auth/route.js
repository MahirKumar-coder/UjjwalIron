import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GstCustomer from '@/models/GstCustomer';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    await dbConnect();
    const { gstNo, mobileNo } = await request.json();

    if (!gstNo || !mobileNo) {
      return NextResponse.json(
        { success: false, error: 'GST Number and Mobile Number are required.' },
        { status: 400 }
      );
    }

    const customer = await GstCustomer.findOne({
      gstNo: gstNo.toUpperCase().trim(),
      mobileNo: mobileNo.trim()
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer details not found. Please contact CA Admin.' },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    customer.tempOtp = otp;
    customer.tempOtpExpiry = expiry;
    await customer.save();

    console.log(`[GST Portal Auth] OTP for Customer ${customer.name} (${customer.email}): ${otp}`);

    // Try to send email
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    let emailSent = false;

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort),
          secure: parseInt(smtpPort) === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        const mailOptions = {
          from: `"Ujjwal Iron GST Desk" <${smtpUser}>`,
          to: customer.email,
          subject: `🔐 Your OTP for Ujjwal Iron GST Portal`,
          text: `Hi ${customer.name},

Your OTP code to log in to the GST Portal is: ${otp}

This OTP is valid for 5 minutes. If you did not request this, please ignore this email.

Regards,
Ujjwal Iron Sales Team`,
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
      } catch (emailError) {
        console.error('[GST Auth] Mail dispatch failed:', emailError.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: emailSent 
        ? 'OTP sent to your registered email address.' 
        : 'OTP generated (logged to terminal for development/testing).',
      // Return the OTP in development to help the user test if they don't have SMTP set up
      devOtp: (process.env.NODE_ENV !== 'production' || process.env.DEV_OTP_MODE === 'true') ? otp : undefined
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
