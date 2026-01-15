import { Types } from "mongoose";

export type Category = {
  _id: string;
  name: string;
  slug?: string;
  createdAt?: string;
};
export type CategoryDB = {
  _id: Types.ObjectId;
  name: string;
  slug?: string;
  createdAt?: Date;
};
export type Blog = {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  createdAt?: string;
};
export type BlogDB = {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  status: "draft" | "published";
  createdAt?: Date;
  excerpt?: string;
  featuredImage: {
    original: string;
    medium: string;
  };
  category?: Types.ObjectId;
  publishedAt: Date;
  content?: any;
};
