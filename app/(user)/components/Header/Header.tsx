import { connectDB } from "@/app/lib/mongodb";
import CategoryModel from "@/app/models/Category";
import HeaderClient from "./components/HeaderClient";
import { Category } from "@/app/types";

export const dynamic = "force-dynamic"; // important for admin + db pages

export default async function Header() {
  await connectDB();

  const categoriesFromDb = await CategoryModel.find()
    .select("name slug")
    .sort({ name: 1 })
    .lean();

  const categories: Category[] = categoriesFromDb.map((cat: any) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
  }));

  return <HeaderClient categories={categories} />;
}
