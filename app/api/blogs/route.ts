import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuid } from "uuid";
import Blog from "@/app/models/Blog";
import { connectDB } from "@/app/lib/mongodb";
import { generateImageSizes } from "@/app/lib/imageProcessor";
import { slugify } from "@/app/lib/slugify";
import { getAdminFromCookie } from "@/app/lib/auth/adminAuth";
export async function POST(request: Request) {
  try {
    await connectDB();

    const admin = await getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const title = (formData.get("title") as string)?.trim();
    const excerpt = (formData.get("excerpt") as string) || "";
    const category = formData.get("category") as string;
    const status = (formData.get("status") as string) || "draft";

    let content: any;
    let tags: string[];

    try {
      content = JSON.parse(formData.get("content") as string);
      tags = JSON.parse((formData.get("tags") as string) || "[]");
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    if (!title || !content || !category) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const cleanContent = {
      ...content,
      blocks: content.blocks?.filter(
        (b: any) => b.type !== "paragraph" || b.data?.text?.trim()
      ),
    };

    const blogId = uuid();
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "blogs",
      blogId
    );

    let featuredImage = null;
    const featuredFile = formData.get("featuredImage") as File | null;

    if (featuredFile?.type.startsWith("image/")) {
      const buffer = Buffer.from(await featuredFile.arrayBuffer());
      featuredImage = await generateImageSizes(
        buffer,
        uploadDir,
        "featured"
      );
    }

    const blog = await Blog.create({
      title,
      slug: slugify(title),
      excerpt,
      content: cleanContent,
      featuredImage,
      category,
      tags,
      status,
      publishedAt: status === "published" ? new Date() : null,
      author: admin.objectId,
      createdBy: { id: admin.objectId, model: "Admin" },
      updatedBy: { id: admin.objectId, model: "Admin" },
    });

    return NextResponse.json(
      { success: true, id: blog._id.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create blog error:", error);
    return NextResponse.json(
      { message: "Failed to create blog" },
      { status: 500 }
    );
  }
}
