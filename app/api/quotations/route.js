import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Quotation from '@/models/Quotation';

// Passcode authentication helper
function isAuthenticated(request) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const requestPassword = request.headers.get('x-admin-password');
  return requestPassword === adminPassword;
}

// GET /api/quotations - Get all quotations (admin only)
export async function GET(request) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Invalid admin password.' },
        { status: 401 }
      );
    }

    await dbConnect();
    const quotations = await Quotation.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, data: quotations }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/quotations - Create a new quotation
export async function POST(request) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Invalid admin password.' },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await request.json();
    const quotation = await Quotation.create(body);

    return NextResponse.json({ success: true, data: quotation }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
