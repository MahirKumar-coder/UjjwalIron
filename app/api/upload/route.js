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

    // Determine the correct Cloudinary resource type & endpoint based on file format
    const isPdf = file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf');
    const resourceType = isPdf ? 'raw' : 'image';

    // Convert the File object to a Base64 Data URI to prevent binary transfer corruption
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64File = `data:${file.type || 'application/pdf'};base64,${buffer.toString('base64')}`;

    // Build the payload to forward to Cloudinary REST API
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', base64File);
    cloudinaryFormData.append('upload_preset', uploadPreset);
    cloudinaryFormData.append('resource_type', resourceType);

    // Call Cloudinary Upload Endpoint (using the dedicated pipeline for images or raw documents)
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
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

    let finalUrl = result.secure_url;
    if (resourceType === 'raw' && finalUrl && !finalUrl.toLowerCase().endsWith('.pdf')) {
      finalUrl = finalUrl + '.pdf';
    }

    // Return the permanent, secure URL of the uploaded image/PDF
    return NextResponse.json({
      success: true,
      url: finalUrl
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
