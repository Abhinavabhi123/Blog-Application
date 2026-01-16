import mongoose, { Schema, Types } from "mongoose";

const dummyUserId = new mongoose.Types.ObjectId();

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    excerpt: {
      type: String,
      maxlength: 300,
    },

    content: {
      type: Schema.Types.Mixed,
      required: true,
    },

    featuredImage: {
      original: String,
      large: String,
      medium: String,
      thumb: String,
      alt: String,
    },

    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    tags: [String],

    author: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      default: null,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
    },

    publishedAt: {
      type: Date,
    },

    seo: {
      title: String,
      description: String,
      keywords: [String],
      ogImage: String,
    },

    views: [
      {
        userId: {
          type: Types.ObjectId,
          ref: "user",
        },
      },
    ],
    likes: [
      {
        userId: {
          type: Types.ObjectId,
          ref: "user",
        },
      },
    ],
    shares: [
      {
        userId: {
          type: Types.ObjectId,
          ref: "user",
        },
      },
    ],

    commentsEnabled: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      id: {
        type: Types.ObjectId,
        required: true,
        refPath: "createdBy.model",
        default: null,
      },
      model: {
        type: String,
        required: true,
        enum: ["Admin", "User"],
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
