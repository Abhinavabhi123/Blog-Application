import BlogGrid from "./BlogGrid";
import { connectDB } from "@/app/lib/mongodb";
import Blog from "@/app/models/Blog";
import { BlogDB } from "@/app/types";

export default async function Blogs() {
  await connectDB();

  const blogs = await Blog.find({ status: "published" })
    .sort({ createdAt: -1 })
    .limit(12)
    .lean<BlogDB[]>();

  const serialized = blogs.map((b) => ({
    _id: b._id.toString(),
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt,
    featuredImage: b.featuredImage,
    createdAt: b.createdAt?.toISOString(),
    category: b.category?.toString(),
  }));

  return <BlogGrid blogs={serialized} />;
}
