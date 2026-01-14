import { Types } from "mongoose";

export type Category = {
  _id: string;
  name: string;
  slug: string;
  createdAt?: string;
};
export type CategoryDB = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  createdAt?: Date;
};
