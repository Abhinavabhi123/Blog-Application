import Blog from "@/app/models/Blog";
import Header from "../components/Header/Header";

import styles from "./Blogs.module.css";
import Category from "@/app/models/Category";
import BlogGrid from "./components/BlogGrid";
import { connectDB } from "@/app/lib/mongodb";
import Footer from "../components/Footer/Footer";
import { BlogDB } from "@/app/types";

export const dynamic = "force-dynamic";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  await connectDB();

  const q = searchParams.q || "";
  const category = searchParams.category || "";

  const filter: any = {};
  if (q) filter.title = { $regex: q, $options: "i" };
  if (category) filter.category = category;

  const blogs = (
    await Blog.find(filter)
      .select("title slug excerpt featuredImage createdAt category")
      .sort({ createdAt: -1 })
      .lean<BlogDB[]>()
  ).map((b: BlogDB) => ({
    _id: b._id.toString(),
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt,
    featuredImage: b.featuredImage,
    category: b.category?.toString(),
    createdAt: b.createdAt ,
  }));

  const categories = await Category.find()
    .select("name slug")
    .sort({ name: 1 })
    .lean();

  return (
    <>
      <Header />

      <main className={styles.container}>
        <h1 className={styles.title}>Blogs</h1>

        <BlogGrid
          blogs={blogs.map((b: any) => ({
            ...b,
            _id: b._id.toString(),
            createdAt: b.createdAt.toISOString(),
          }))}
          categories={categories.map((c: any) => ({
            _id: c._id.toString(),
            name: c.name,
            slug: c.slug,
          }))}
          search={q}
          selectedCategory={category}
        />
      </main>
      <Footer />
    </>
  );
}
