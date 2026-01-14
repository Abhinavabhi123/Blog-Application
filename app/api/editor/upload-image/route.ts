import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuid } from "uuid";
import { generateImageSizes } from "@/app/lib/imageProcessor";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { success: 0, message: "No file uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadDir = path.join(process.cwd(), "uploads", "blogs", "editor");

    const image = await generateImageSizes(buffer, uploadDir, uuid());

    return NextResponse.json({
      success: 1,
      file: {
        url: image.large,
      },
    });
  } catch (error) {
    console.error("Editor upload error:", error);
    return NextResponse.json({ success: 0 }, { status: 500 });
  }
}
