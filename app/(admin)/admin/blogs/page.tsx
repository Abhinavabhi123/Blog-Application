import BlogsClient from "./components/BlogsClient";
import { connectDB } from "@/app/lib/mongodb";
import Blog from "@/app/models/Blog";
import { BlogDB } from "@/app/types";

export default async function Page() {
  await connectDB();

  const page = 1; 
  const limit = 10;
  const skip = (page - 1) * limit;

  const [blogs, total] = await Promise.all([
    Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<BlogDB[]>(),
    Blog.countDocuments(),
  ]);

  const serializedBlogs = blogs.map((b) => ({
    _id: b._id.toString(),
    title: b.title,
    slug: b.slug,
    status: b.status,
    createdAt: b.createdAt?.toISOString(),
  }));

  return <BlogsClient initialBlogs={serializedBlogs} initialTotal={total} />;
}
