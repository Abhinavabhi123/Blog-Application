import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuid } from "uuid";
import { generateImageSizes } from "@/app/lib/imageProcessor";
import { getAdminFromCookie } from "@/app/lib/auth/adminAuth";

export async function POST(request: Request) {
  try {
    const admin = await getAdminFromCookie();
    if (!admin) {
      return NextResponse.json(
        { success: 0, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: 0, message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: 0, message: "Invalid file type" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const imageId = uuid();

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "blogs",
      "editor",
      imageId
    );

    const image = await generateImageSizes(
      buffer,
      uploadDir,
      "editor"
    );

    return NextResponse.json({
      success: 1,
      file: {
        url: image.large, // PUBLIC URL
      },
    });
  } catch (error) {
    console.error("Editor upload error:", error);
    return NextResponse.json(
      { success: 0, message: "Upload failed" },
      { status: 500 }
    );
  }
}
