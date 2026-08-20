import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AuditLog from '@/models/AuditLog';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const caPassword = process.env.CA_PASSWORD || 'ca123';

    if (password !== caPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid CA passcode.' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Log the CA login audit log
    await AuditLog.create({
      type: 'ca_login',
      message: `CA Admin logged in on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
    });

    return NextResponse.json({
      success: true,
      message: 'CA authentication successful'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
