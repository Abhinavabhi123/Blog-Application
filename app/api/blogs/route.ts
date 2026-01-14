import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuid } from "uuid";
import Blog from "@/app/models/Blog";
import { connectDB } from "@/app/lib/mongodb";
import { generateImageSizes } from "@/app/lib/imageProcessor";

export async function POST(request: Request) {
  try {
    await connectDB();

    const formData = await request.formData();

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = JSON.parse(formData.get("content") as string);
    const category = formData.get("category") as string;
    const tags = JSON.parse((formData.get("tags") as string) || "[]");
    const seo = JSON.parse((formData.get("seo") as string) || "{}");
    const status = (formData.get("status") as string) || "draft";

    if (!title || !slug || !content || !category) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const blogId = uuid();
    const uploadDir = path.join(process.cwd(), "uploads", "blogs", blogId);

    /* =====================
       FEATURED IMAGE
    ====================== */
    let featuredImage = {};

    const featuredFile = formData.get("featuredImage") as File | null;

    if (featuredFile) {
      const buffer = Buffer.from(await featuredFile.arrayBuffer());
      featuredImage = await generateImageSizes(buffer, uploadDir, "featured");
    }

    /* =====================
       SAVE BLOG
    ====================== */
    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      seo,
      status,
      publishedAt: status === "published" ? new Date() : null,
      author: "USER_ID_HERE", // replace with auth user
      createdBy: {
        id: "USER_ID_HERE",
        model: "Admin",
      },
    });

    return NextResponse.json({ success: true, blog }, { status: 201 });
  } catch (error) {
    console.error("Create blog error:", error);
    return NextResponse.json(
      { message: "Failed to create blog" },
      { status: 500 }
    );
  }
}
