import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Quotation from '@/models/Quotation';

function isAuthenticated(request) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const requestPassword = request.headers.get('x-admin-password');
  return requestPassword === adminPassword;
}

// PUT /api/quotations/[id] - Update a quotation by ID
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

    const quotation = await Quotation.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!quotation) {
      return NextResponse.json(
        { success: false, error: 'Quotation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: quotation }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE /api/quotations/[id] - Delete a quotation by ID
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

    const quotation = await Quotation.findByIdAndDelete(id);

    if (!quotation) {
      return NextResponse.json(
        { success: false, error: 'Quotation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Quotation deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
