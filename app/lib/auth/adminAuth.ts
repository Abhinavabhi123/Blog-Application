import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { cookies } from "next/headers";

export type AdminTokenPayload = {
  id: string;
  role: string;
};

export async function getAdminFromCookie() {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("admin_token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AdminTokenPayload;

    return {
      ...decoded,
      objectId: new mongoose.Types.ObjectId(decoded.id),
    };
  } catch {
    return null;
  }
}
