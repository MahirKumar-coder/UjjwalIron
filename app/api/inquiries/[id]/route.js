import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Inquiry from '@/models/Inquiry';

function isAuthenticated(request) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const requestPassword = request.headers.get('x-admin-password');
  return requestPassword === adminPassword;
}

// PUT /api/inquiries/[id] - Update inquiry status (Admin Only)
export async function PUT(request, { params }) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Invalid admin password.' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['New', 'Contacted', 'Closed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: inquiry }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE /api/inquiries/[id] - Delete inquiry (Admin Only)
export async function DELETE(request, { params }) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Invalid admin password.' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = params;

    const inquiry = await Inquiry.findByIdAndDelete(id);

    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Inquiry deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
