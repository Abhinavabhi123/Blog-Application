import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Blog from "@/app/models/Blog";

export async function GET(request: Request) {
  await connectDB();

  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

  const skip = (page - 1) * limit;

  const filter = search
    ? { title: { $regex: search, $options: "i" } }
    : {};

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
