import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function isAuthenticated(request) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const requestPassword = request.headers.get('x-admin-password');
  return requestPassword === adminPassword;
}

export async function POST(request) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized access.' }, { status: 401 });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const targetEmail = process.env.NOTIFICATION_EMAIL || smtpUser;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      return NextResponse.json({
        success: false,
        error: 'SMTP credentials are missing from server environment variables.'
      }, { status: 400 });
    }

    console.log(`[SMTP Test] Starting SMTP test to ${targetEmail} via ${smtpHost}`);

    // Construct transporter (Optimize for Gmail service fallback)
    const isGmail = smtpHost.toLowerCase().includes('gmail.com');
    const transporter = isGmail
      ? nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        })
      : nodemailer.createTransport({
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
      from: `"Ujjwal Iron SMTP Diagnostic" <${smtpUser}>`,
      to: targetEmail,
      subject: `🧪 Ujjwal Iron SMTP Test Mail`,
      text: `Congratulations! If you received this email, it means your SMTP configuration on Ujjwal Iron is fully functional in production!

SMTP Host: ${smtpHost}
SMTP Port: ${smtpPort}
SMTP User: ${smtpUser}
Target Email: ${targetEmail}

Sent At: ${new Date().toLocaleString()}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: `Test email successfully sent to ${targetEmail}! Check your inbox.`
    });

  } catch (error) {
    console.error('[SMTP Test Error]:', error);
    return NextResponse.json({
      success: false,
      error: `SMTP Connection Failed: ${error.message}. Please verify your Gmail App Password configuration.`
    }, { status: 500 });
  }
}
