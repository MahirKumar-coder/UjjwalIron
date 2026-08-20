import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GstCustomer from '@/models/GstCustomer';

export async function POST(request) {
  try {
    await dbConnect();
    const { gstNo, otp } = await request.json();

    if (!gstNo || !otp) {
      return NextResponse.json(
        { success: false, error: 'GST Number and OTP are required.' },
        { status: 400 }
      );
    }

    const customer = await GstCustomer.findOne({
      gstNo: gstNo.toUpperCase().trim()
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found.' },
        { status: 404 }
      );
    }

    if (!customer.tempOtp || customer.tempOtp !== otp.trim()) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP code.' },
        { status: 400 }
      );
    }

    if (new Date() > new Date(customer.tempOtpExpiry)) {
      return NextResponse.json(
        { success: false, error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // OTP verified successfully, clear temporary columns
    customer.tempOtp = undefined;
    customer.tempOtpExpiry = undefined;
    await customer.save();

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      customer: {
        name: customer.name,
        gstNo: customer.gstNo,
        email: customer.email,
        mobileNo: customer.mobileNo,
        downloadVerified: customer.downloadVerified
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
