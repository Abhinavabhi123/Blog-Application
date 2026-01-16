import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Blog from "@/app/models/Blog";
import path from "path";
import { v4 as uuid } from "uuid";
import { generateImageSizes } from "@/app/lib/imageProcessor";
import { slugify } from "@/app/lib/slugify";
import { getAdminFromCookie } from "@/app/lib/auth/adminAuth";

export async function GET(request: Request) {
  await connectDB();

  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

  const skip = (page - 1) * limit;

  const filter = search ? { title: { $regex: search, $options: "i" } } : {};

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments(filter),
  ]);

  const serializedBlogs = blogs.map((b) => ({
    _id: b._id,
    title: b.title,
    slug: b.slug,
    status: b.status,
    createdAt: b.createdAt?.toISOString(),
  }));

  return NextResponse.json({
    blogs: serializedBlogs,
    total,
  });
}

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
      const tagsRaw = formData.get("tags");
      tags = tagsRaw ? JSON.parse(tagsRaw as string) : [];
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
      featuredImage = await generateImageSizes(buffer, uploadDir, "featured");
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
