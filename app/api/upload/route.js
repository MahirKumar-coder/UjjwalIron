import { NextResponse } from 'next/server';

function isAuthenticated(request) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const caPassword = process.env.CA_PASSWORD || 'ca123';
  const requestPassword = request.headers.get('x-admin-password') || request.headers.get('x-ca-password');
  return requestPassword === adminPassword || requestPassword === caPassword;
}

// POST /api/upload - Handle admin/ca file uploads (images and PDFs) to Cloudinary
export async function POST(request) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized passcode.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file was provided.' },
        { status: 400 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return NextResponse.json(
        { success: false, error: 'Cloudinary server configurations are missing (CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET).' },
        { status: 500 }
      );
    }

    // Build the payload to forward to Cloudinary REST API
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', uploadPreset);
    cloudinaryFormData.append('resource_type', 'auto');

    // Call Cloudinary Upload Endpoint (using auto detection to support images and PDFs)
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    );

    const result = await cloudinaryResponse.json();

    if (!cloudinaryResponse.ok) {
      return NextResponse.json(
        { success: false, error: result.error?.message || 'Failed to upload asset to Cloudinary.' },
        { status: cloudinaryResponse.status }
      );
    }

    // Return the permanent, secure URL of the uploaded image/PDF
    return NextResponse.json({
      success: true,
      url: result.secure_url
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
