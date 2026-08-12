import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

// Simple passcode authentication helper
function isAuthenticated(request) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const requestPassword = request.headers.get('x-admin-password');
  return requestPassword === adminPassword;
}

// GET /api/products - Get all products (active & inactive)
export async function GET(request) {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ updatedAt: -1 });
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
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
    const product = await Product.create(body);

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
