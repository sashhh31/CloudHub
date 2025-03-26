import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, name } = body;

    if (!image) {
      return NextResponse.json({ message: "No image provided" }, { status: 400 });
    }

    // Remove the base64 prefix
    const base64Data = image.replace(/^data:image\/png;base64,/, "");

    // Upload to Cloudinary
    const uploadResponse = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload(
        `data:image/png;base64,${base64Data}`, 
        { 
          folder: 'uploads', 
          public_id: name,
          overwrite: true
        }, 
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });
    return NextResponse.json(uploadResponse.secure_url)

  } catch (error) {
    // Type assertion for error
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json({ 
      message: "Error uploading image to Cloudinary", 
      error: errorMessage 
    }, { status: 500 });
  }
}