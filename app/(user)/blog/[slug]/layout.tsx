import Header from "../../components/Header/Header";
import { connectDB } from "@/app/lib/mongodb";
import CategoryModel from "@/app/models/Category";
import { Category, CategoryDB } from "@/app/types";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectDB();

  const categoriesFromDb = await CategoryModel.find()
    .select("name slug")
    .sort({ name: 1 })
    .lean<CategoryDB[]>();

  const categories: Category[] = categoriesFromDb.map((cat) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
  }));

  return (
    <>
      <Header categories={categories} />

      <main className="blog-container">
        {children}
      </main>
    </>
  );
}
