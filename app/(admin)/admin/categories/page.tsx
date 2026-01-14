import CategoriesClient from "./components/CategoriesClient";
import { connectDB } from "@/app/lib/mongodb";
import CategoryModel from "@/app/models/Category";
import type { Category, CategoryDB } from "./types";

export default async function Page() {
  await connectDB();

  const page = 1;
  const limit = 10;

  const categoriesFromDb = await CategoryModel.find()
    .select("_id name slug createdAt")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean<CategoryDB[]>();

  const total = await CategoryModel.countDocuments();

  const categories: Category[] = categoriesFromDb.map((cat) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
    createdAt: cat.createdAt?.toISOString(),
  }));

  return (
    <CategoriesClient
      initialCategories={categories}
      initialTotal={total}
      initialPage={page}
      limit={limit}
    />
  );
}
