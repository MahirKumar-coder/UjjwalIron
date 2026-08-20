import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GstCustomer from '@/models/GstCustomer';
import AuditLog from '@/models/AuditLog';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { action, gstNo, mobileNo, otp, billNo } = body;

    if (!gstNo) {
      return NextResponse.json({ success: false, error: 'GST Number is required.' }, { status: 400 });
    }

    const customer = await GstCustomer.findOne({ gstNo: gstNo.toUpperCase().trim() });
    if (!customer) {
      return NextResponse.json({ success: false, error: 'Customer not found.' }, { status: 404 });
    }

    // ACTION: request-otp (sent for download verification if not already verified)
    if (action === 'request-otp') {
      if (!mobileNo || mobileNo.trim() !== customer.mobileNo) {
        return NextResponse.json({ success: false, error: 'Registered mobile number does not match.' }, { status: 400 });
      }

      // Generate 6-digit OTP for PDF download auth
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

      customer.tempOtp = code;
      customer.tempOtpExpiry = expiry;
      await customer.save();

      console.log(`[GST Download Auth] OTP for Customer ${customer.name} to download PDF: ${code}`);

      // Try sending OTP email
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
            from: `"Ujjwal Iron Security" <${smtpUser}>`,
            to: customer.email,
            subject: `🔐 Verify PDF Download - Ujjwal Iron`,
            text: `Hi ${customer.name},

Your OTP code to verify and authorize your first PDF download is: ${code}

This code is valid for 5 minutes.

Regards,
Ujjwal Iron Sales Team`,
          };

          await transporter.sendMail(mailOptions);
          emailSent = true;
        } catch (emailError) {
          console.error('[GST Download Auth] SMTP dispatch failed:', emailError.message);
        }
      }

      return NextResponse.json({
        success: true,
        message: emailSent ? 'OTP code sent to your registered email.' : 'OTP generated (logged to terminal for development/testing).',
        devOtp: (process.env.NODE_ENV !== 'production' || process.env.DEV_OTP_MODE === 'true') ? code : undefined
      });
    }

    // ACTION: verify-otp
    if (action === 'verify-otp') {
      if (!otp) {
        return NextResponse.json({ success: false, error: 'OTP code is required.' }, { status: 400 });
      }

      if (!customer.tempOtp || customer.tempOtp !== otp.trim()) {
        return NextResponse.json({ success: false, error: 'Invalid OTP code.' }, { status: 400 });
      }

      if (new Date() > new Date(customer.tempOtpExpiry)) {
        return NextResponse.json({ success: false, error: 'OTP has expired. Please request a new code.' }, { status: 400 });
      }

      // Mark customer download verified
      customer.downloadVerified = true;
      customer.tempOtp = undefined;
      customer.tempOtpExpiry = undefined;
      await customer.save();

      return NextResponse.json({ success: true, message: 'PDF Download verified and unlocked!' });
    }

    // ACTION: log-download
    if (action === 'log-download') {
      if (!billNo) {
        return NextResponse.json({ success: false, error: 'Bill number is required to log download.' }, { status: 400 });
      }

      // Log download to AuditLog
      await AuditLog.create({
        type: 'pdf_download',
        message: `Customer ${customer.name} (GST: ${customer.gstNo}) downloaded GST Bill #${billNo} on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
      });

      return NextResponse.json({ success: true, message: 'Download logged successfully.' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action parameter.' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
