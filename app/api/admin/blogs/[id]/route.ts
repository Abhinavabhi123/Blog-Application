import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Blog from "@/app/models/Blog";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await connectDB();

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const category = formData.get("category") as string;
    const status = formData.get("status") as "draft" | "published";
    const content = JSON.parse(formData.get("content") as string);
    const tagsRaw = formData.get("tags");
    const tags: string[] = tagsRaw ? JSON.parse(tagsRaw as string) : [];
    const featuredImage = formData.get("featuredImage") as File | null;

    if (!title || !excerpt || !category || !status || !content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updateData: any = {
      title,
      excerpt,
      category,
      status,
      content,
      tags,
    };

    // 🔄 Replace image ONLY if uploaded
    if (featuredImage && featuredImage.size > 0) {
      const bytes = await featuredImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = featuredImage.type.split("/")[1];
      const fileName = `${crypto.randomUUID()}.${ext}`;

      const uploadDir = path.join(process.cwd(), "public/uploads/blogs", id);

      await mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      updateData.featuredImage = {
        original: `/uploads/blogs/${id}/${fileName}`,
        medium: `/uploads/blogs/${id}/${fileName}`,
      };
    }

    const blog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error("Update blog error:", error);
    return NextResponse.json(
      { message: "Failed to update blog" },
      { status: 500 }
    );
  }
}
