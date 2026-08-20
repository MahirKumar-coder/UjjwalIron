import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GstCustomer from '@/models/GstCustomer';
import GstBill from '@/models/GstBill';

function isCAAuthorized(request) {
  const caPassword = process.env.CA_PASSWORD || 'ca123';
  const headerPassword = request.headers.get('x-ca-password');
  return headerPassword === caPassword;
}

// GET: Fetch all verified GST customers
export async function GET(request) {
  try {
    if (!isCAAuthorized(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized CA access.' }, { status: 401 });
    }

    await dbConnect();
    const customers = await GstCustomer.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, data: customers });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Add a new verified GST customer
export async function POST(request) {
  try {
    if (!isCAAuthorized(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized CA access.' }, { status: 401 });
    }

    await dbConnect();
    const { name, gstNo, mobileNo, email } = await request.json();

    if (!name || !gstNo || !mobileNo || !email) {
      return NextResponse.json({ success: false, error: 'All fields (name, gstNo, mobileNo, email) are required.' }, { status: 400 });
    }

    // Check if customer exists
    const existing = await GstCustomer.findOne({ gstNo: gstNo.toUpperCase().trim() });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Customer with this GST number already registered.' }, { status: 400 });
    }

    const customer = await GstCustomer.create({
      name: name.trim(),
      gstNo: gstNo.toUpperCase().trim(),
      mobileNo: mobileNo.trim(),
      email: email.toLowerCase().trim()
    });

    return NextResponse.json({ success: true, data: customer }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a customer
export async function DELETE(request) {
  try {
    if (!isCAAuthorized(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized CA access.' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Customer ID required.' }, { status: 400 });
    }

    const customer = await GstCustomer.findById(id);
    if (!customer) {
      return NextResponse.json({ success: false, error: 'Customer not found.' }, { status: 404 });
    }

    // Optional: Delete customer bills? Or keep them. Let's delete their bills as well to be clean
    await GstBill.deleteMany({ gstNo: customer.gstNo });
    await GstCustomer.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Customer and their bills removed.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
