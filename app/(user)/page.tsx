import { connectDB } from "../lib/mongodb";
import { Category, CategoryDB } from "../types";
import { heroSlides } from "./components/constants";
import Header from "./components/Header/Header";
import HeroSection from "./components/Hero/HeroSection";
import CategoryModel from "@/app/models/Category";

export default async function page() {
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
  await new Promise((res) => setTimeout(res, 1000));
  return (
    <div>
      <Header categories={categories} />
      <HeroSection main={heroSlides.main} side={heroSlides.side} />
    </div>
  );
}
