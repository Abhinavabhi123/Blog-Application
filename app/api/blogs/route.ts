import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuid } from "uuid";
import Blog from "@/app/models/Blog";
import { connectDB } from "@/app/lib/mongodb";
import { generateImageSizes } from "@/app/lib/imageProcessor";
import { slugify } from "@/app/lib/slugify";
import { getAdminFromCookie } from "@/app/lib/auth/adminAuth";
