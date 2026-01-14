import { connectDB } from "@/app/lib/mongodb";
import { slugify } from "@/app/lib/slugify";
import Category from "@/app/models/Category";
import { NextResponse } from "next/server";

// to create the category
export async function POST(req: Request) {
  try {
    await connectDB();

    const { name } = await req.json();

    if (!name || name.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Category name is required",
        },
        { status: 400 }
      );
    }

    const normalizedName = name.trim();
    const slug = slugify(normalizedName);

    const existingCategory = await Category.findOne({
      slug,
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Category already exists",
        },
        { status: 409 }
      );
    }

    const categoryData = await Category.create({
      name: normalizedName,
      slug,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        category: categoryData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Category creation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// to get the all category
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      Category.find()
        .select("_id name slug createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Category.countDocuments(),
    ]);

    return NextResponse.json({
      categories: categories.map((cat) => ({
        _id: cat._id.toString(),
        name: cat.name,
        slug: cat.slug,
        createdAt: cat.createdAt?.toISOString(),
      })),
      total,
      page,
      limit,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
