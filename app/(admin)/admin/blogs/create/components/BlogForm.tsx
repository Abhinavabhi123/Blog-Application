"use client";

import { Input } from "@/app/(admin)/components/form/Input";
import Editor from "../../components/Editor";
import { Button } from "@/app/(admin)/components/form/Button";
import { Textarea } from "@/app/(admin)/components/form/Textarea";
import { Select } from "@/app/(admin)/components/form/Select";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { errorToast, successToast } from "@/app/lib/toast";
import { Category } from "@/app/types";
import styles from "./BlogForm.module.css";
import Image from "next/image";

type BlogFormProps = {
  category: Category[];
  mode?: "create" | "edit";
  initialData?: {
    _id: string;
    title: string;
    excerpt: string;
    categoryId: string;
    status: "draft" | "published";
    content: any;
    tags?: string[];
    featuredImage?: {
      medium: string;
    };
  };
};

const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const blogSchema = (mode: "create" | "edit") =>
  Yup.object({
    title: Yup.string()
      .trim()
      .min(5, "Title must be at least 5 characters")
      .max(200, "Title is too long")
      .required("Title is required"),

    excerpt: Yup.string()
      .max(300, "Excerpt must be under 300 characters")
      .required("Excerpt is required"),

    categoryId: Yup.string().required("Category is required"),

    status: Yup.mixed<"draft" | "published">()
      .oneOf(["draft", "published"])
      .required(),
    tags: Yup.array()
      .of(Yup.string().trim().min(2))
      .min(1, "At least one tag is required")
      .max(10, "Maximum 10 tags allowed"),

    featuredImage: Yup.mixed<File>()
      .nullable()
      .test(
        "required-image",
        "Image is required",
        (file) => mode === "edit" || !!file
      )
      .test(
        "fileSize",
        "Image must be less than 5MB",
        (file) => !file || file.size <= MAX_FILE_SIZE
      )
      .test(
        "fileFormat",
        "Unsupported image format",
        (file) => !file || SUPPORTED_FORMATS.includes(file.type)
      ),
  });

export default function BlogForm({
  category,
  mode = "create",
  initialData,
}: BlogFormProps) {
  const router = useRouter();

  const [editorContent, setEditorContent] = useState<any>(
    mode === "edit" ? initialData?.content : null
  );

  const [preview, setPreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  const categoryOptions = category.map((cat) => ({
    value: cat._id.toString(),
    label: cat.name,
  }));

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: initialData?.title || "",
      excerpt: initialData?.excerpt || "",
      categoryId: initialData?.categoryId || "",
      status: initialData?.status || "draft",
      featuredImage: null as File | null,
      tags: initialData?.tags || [],
    },
    validationSchema: blogSchema(mode),
    onSubmit: async (values, { setSubmitting }) => {
      if (!editorContent) {
        errorToast("Blog content is required");
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("excerpt", values.excerpt);
      formData.append("category", values.categoryId);
      formData.append("status", values.status);
      formData.append("content", JSON.stringify(editorContent));
      formData.append("tags", JSON.stringify(values.tags));

      if (values.featuredImage) {
        formData.append("featuredImage", values.featuredImage);
      }

      try {
        const url =
          mode === "edit"
            ? `/api/admin/blogs/${initialData?._id}`
            : `/api/admin/blogs`;

        const method = mode === "edit" ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          body: formData,
        });

        if (!res.ok) {
          errorToast(
            mode === "edit" ? "Failed to create blog" : "Failed to Update blog"
          );
          return;
        }

        successToast("Blog created successfully");
        router.push("/admin/blogs");
      } catch {
        errorToast("Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <form onSubmit={formik.handleSubmit}>
      {/* Title */}
      <Input
        label="Title"
        required
        value={formik.values.title}
        onChange={(e) => formik.setFieldValue("title", e.target.value)}
      />
      {formik.touched.title && formik.errors.title && (
        <p className={styles.error}>{formik.errors.title}</p>
      )}

      {/* Excerpt */}
      <Textarea
        label="Excerpt"
        value={formik.values.excerpt}
        required
        onChange={(e) => formik.setFieldValue("excerpt", e.target.value)}
      />
      <p className={styles.excerptCount}>{`${
        formik.values.excerpt.length || 0
      }/300`}</p>
      {formik.touched.excerpt && formik.errors.excerpt && (
        <p className={styles.error}>{formik.errors.excerpt}</p>
      )}

      {/* Category */}
      <Select
        label="Category"
        value={formik.values.categoryId}
        options={categoryOptions}
        required
        onChange={(e) => formik.setFieldValue("categoryId", e.target.value)}
      />
      {formik.touched.categoryId && formik.errors.categoryId && (
        <p className={styles.error}>{formik.errors.categoryId}</p>
      )}
      {/* Tags */}
      <div className={styles.tagsInput}>
        <Input
          type="text"
          label="Tags"
          placeholder="Type tag and press Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && tagInput.trim()) {
              e.preventDefault();

              if (!formik.values.tags.includes(tagInput.trim())) {
                formik.setFieldValue("tags", [
                  ...formik.values.tags,
                  tagInput.trim(),
                ]);
              }
              setTagInput("");
            }
          }}
        />
      </div>

      {formik.touched.tags && formik.errors.tags && (
        <p className={styles.error}>{formik.errors.tags as string}</p>
      )}

      <div className={styles.tagsList}>
        {formik.values.tags.map((tag, index) => (
          <span key={index} className={styles.tag}>
            {tag}
            <button
              type="button"
              onClick={() =>
                formik.setFieldValue(
                  "tags",
                  formik.values.tags.filter((_, i) => i !== index)
                )
              }
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Featured Image */}
      <Input
        label="Featured Image"
        type="file"
        value={""}
        required
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          formik.setFieldValue("featuredImage", file);

          if (file) {
            setPreview(URL.createObjectURL(file));
          } else {
            setPreview(null);
          }
        }}
      />
      {formik.touched.featuredImage && formik.errors.featuredImage && (
        <p className={styles.error}>{formik.errors.featuredImage}</p>
      )}
      {mode === "edit" && initialData?.featuredImage?.medium && !preview && (
        <div className={styles.imagePreview}>
          <Image
            src={initialData.featuredImage.medium}
            alt="Current Image"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      {/* Image Preview */}
      {preview && (
        <div className={styles.imagePreview}>
          <Image
            src={preview}
            alt="Featured Preview"
            fill
            unoptimized
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      {/* Editor */}
      <label className={styles.contentLabel}>Content</label>
      <Editor onChange={setEditorContent} initialData={editorContent} />

      {/* Actions */}
      <div className={styles.actions}>
        <Button
          variant="secondary"
          type="submit"
          onClick={() => formik.setFieldValue("status", "draft")}
          disabled={formik.isSubmitting}
        >
          {formik.values.status === "draft" && formik.isSubmitting
            ? "Saving..."
            : "Save Draft"}
        </Button>

        <Button
          variant="primary"
          type="submit"
          onClick={() => formik.setFieldValue("status", "published")}
          disabled={formik.isSubmitting}
        >
          {formik.values.status === "published" && formik.isSubmitting
            ? `${mode === "edit" ? "Updating..." : "Publishing..."}`
            : `${mode === "edit" ? "Update Blog" : "Publish"}`}
        </Button>
      </div>
    </form>
  );
}
