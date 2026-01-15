import { connectDB } from "@/app/lib/mongodb";
import BlogForm from "./components/BlogForm";
import styles from "./CreateBlogPage.module.css";
import Category from "@/app/models/Category";
import { CategoryDB } from "@/app/types";

export default async function CreateBlogPage() {
  await connectDB();
  const categories = (await Category.find().lean<CategoryDB[]>()).map(
    (cat) => ({
      ...cat,
      _id: cat._id.toString(),
      createdAt: cat.createdAt ? cat.createdAt.toISOString() : undefined,
    })
  );

  return (
    <div className={styles.blogCreateWrapper}>
      <h1>Create Blog</h1>
      <BlogForm category={categories} />
    </div>
  );
}
