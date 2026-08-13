import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, productNeeded, message } = body;

    // 1. Nodemailer Transporter configured with your Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // Your Gmail App Password
      },
    });

    // 2. Setup Email Data
    const mailOptions = {
      from: `"Ujjwal Iron Website" <${process.env.SMTP_USER}>`, // Sender address
      to: process.env.NOTIFICATION_EMAIL, // Your friend's business email
      subject: `🚨 New Lead: ${name} - Ujjwal Iron`, // Subject line
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; rounded-corners: 8px;">
          <h2 style="color: #1e3a8a; margin-bottom: 20px;">New Inquiry Received</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 150px;">Name:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Phone Number:</td>
              <td style="padding: 8px 0;"><a href="tel:${phone}">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Products Needed:</td>
              <td style="padding: 8px 0; color: #0284c7;">${productNeeded || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Additional Message:</td>
              <td style="padding: 8px 0; white-space: pre-wrap;">${message || 'No extra specifications provided.'}</td>
            </tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">This email was automatically generated from the Ujjwal Iron Web Portal.</p>
        </div>
      `,
    };

    // 3. Send Email
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error. Failed to send email notification.' },
      { status: 500 }
    );
  }
}