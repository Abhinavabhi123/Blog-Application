import BlogsClient from "./components/BlogsClient";

const demoBlogs = [
  {
    _id: "1",
    title: "This Is A Standard Format Post",
    slug: "this-is-a-standard-format-post",
    status: "published",
    createdAt: "2024-01-10T10:30:00.000Z",
  },
  {
    _id: "2",
    title: "Minimalism in Modern Web Design",
    slug: "minimalism-in-modern-web-design",
    status: "draft",
    createdAt: "2024-01-05T08:15:00.000Z",
  },
  {
    _id: "3",
    title: "Why Performance Matters in Next.js",
    slug: "why-performance-matters-in-nextjs",
    status: "published",
    createdAt: "2023-12-28T14:45:00.000Z",
  },
];

export default function Page() {
  return <BlogsClient initialBlogs={demoBlogs} />;
}
