import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GstBill from '@/models/GstBill';
import GstCustomer from '@/models/GstCustomer';

function isAuthorized(request) {
  const caPassword = process.env.CA_PASSWORD || 'ca123';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const headerPassword = request.headers.get('x-ca-password') || request.headers.get('x-admin-password');
  return headerPassword === caPassword || headerPassword === adminPassword;
}

// GET: Fetch all bills or filter by GSTIN (accessible by CA or customers)
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const gstNo = searchParams.get('gstNo');

    // If CA calls without filtering, they must be authorized
    if (!gstNo && !isAuthorized(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized access.' }, { status: 401 });
    }

    const filter = gstNo ? { gstNo: gstNo.toUpperCase().trim() } : {};
    const bills = await GstBill.find(filter).sort({ billDate: -1 });

    return NextResponse.json({ success: true, data: bills });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Add a new manual GST bill (with PDF upload url)
export async function POST(request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized access.' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { billNo, gstNo, billDate, pdfUrl, totalAmount } = body;

    if (!billNo || !gstNo || !billDate || !pdfUrl || !totalAmount) {
      return NextResponse.json({ success: false, error: 'All fields (billNo, gstNo, billDate, pdfUrl, totalAmount) are required.' }, { status: 400 });
    }

    // Verify if customer is registered
    const customer = await GstCustomer.findOne({ gstNo: gstNo.toUpperCase().trim() });
    if (!customer) {
      return NextResponse.json({ success: false, error: 'Selected GST number is not registered. Please register the customer first.' }, { status: 400 });
    }

    // Check if billNo already exists
    const existing = await GstBill.findOne({ billNo: billNo.trim() });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Bill number already exists.' }, { status: 400 });
    }

    const bill = await GstBill.create({
      billNo: billNo.trim(),
      gstNo: gstNo.toUpperCase().trim(),
      customerName: customer.name,
      billDate: new Date(billDate),
      pdfUrl: pdfUrl.trim(),
      totalAmount: Number(totalAmount),
      cgst: 0,
      sgst: 0,
      igst: 0,
      items: []
    });

    return NextResponse.json({ success: true, data: bill }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
