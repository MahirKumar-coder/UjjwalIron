import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

function isAuthenticated(request) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const requestPassword = request.headers.get('x-admin-password');
  return requestPassword === adminPassword;
}

// PUT /api/products/[id] - Update a product by ID
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

    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product by ID
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

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
