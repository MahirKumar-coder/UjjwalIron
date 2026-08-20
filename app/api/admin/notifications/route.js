import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AuditLog from '@/models/AuditLog';

function isAdminAuthorized(request) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const headerPassword = request.headers.get('x-admin-password');
  return headerPassword === adminPassword;
}

// GET: Fetch all notifications/logs
export async function GET(request) {
  try {
    if (!isAdminAuthorized(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized Admin access.' }, { status: 401 });
    }

    await dbConnect();
    const logs = await AuditLog.find({}).sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Mark logs/notifications as read
export async function POST(request) {
  try {
    if (!isAdminAuthorized(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized Admin access.' }, { status: 401 });
    }

    await dbConnect();
    await AuditLog.updateMany({ read: false }, { $set: { read: true } });
    return NextResponse.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
