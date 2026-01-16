import { notFound } from "next/navigation";
import { connectDB } from "@/app/lib/mongodb";
import Blog from "@/app/models/Blog";
import BlogForm from "../../create/components/BlogForm";
import { BlogDB, CategoryDB } from "@/app/types";
import Category from "@/app/models/Category";

async function getBlog(id: string) {
  await connectDB();

  const blog = await Blog.findById(id).lean<BlogDB>();

  if (!blog) return null;

  return {
    _id: blog._id.toString(),
    title: blog.title,
    excerpt: blog.excerpt,
    content: blog.content,
    status: blog.status,
    categoryId: blog.category?.toString(),
    featuredImage: blog.featuredImage,
  };
}

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const blog = await getBlog(id);
  const categories = (await Category.find().lean<CategoryDB[]>()).map(
    (cat) => ({
      ...cat,
      _id: cat._id.toString(),
      createdAt: cat.createdAt ? cat.createdAt.toISOString() : undefined,
    })
  );

  if (!blog) notFound();

  return <BlogForm mode="edit" initialData={blog} category={categories} />;
}
