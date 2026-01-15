import styles from "./blog.module.css"
import { notFound } from "next/navigation";
import BlogHeader from "./components/BlogHeader";
import BlogContent from "./components/BlogContent";
import { connectDB } from "@/app/lib/mongodb";
import Blog from "@/app/models/Blog";
import { BlogDB} from "@/app/types";

async function getBlog(slug: string) {
  await connectDB();

  const blog = await Blog.findOne({
    slug,
    status: "published",
  }).lean<BlogDB>();

  if (!blog) return null;

  return {
    title: blog.title,
    publishedAt: blog.publishedAt.toISOString(),
    featuredImage: blog.featuredImage,
    content: blog.content,
  };
}

export default async function BlogPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  if (!slug) notFound();

  const blog = await getBlog(slug);

  if (!blog) notFound();

  return (
    <div className={styles.container}>
      <BlogHeader
        title={blog.title}
        publishedAt={blog.publishedAt}
        image={blog.featuredImage.medium}
      />

      <BlogContent blocks={blog.content.blocks} />
    </div>
  );
}
