import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

import bcrypt from "bcryptjs";
import { connectDB } from "../app/lib/mongodb";
import Admin from "../app/models/Admin";

async function createAdmin() {
  try {
    await connectDB();

    const email = "admin@example.com";
    const password = "admin123";

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin created successfully");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create admin", error);
    process.exit(1);
  }
}

createAdmin();
