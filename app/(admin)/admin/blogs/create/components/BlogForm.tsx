"use client";

import { Input } from "@/app/(admin)/components/form/Input";
import Editor from "../../components/Editor";
import { Button } from "@/app/(admin)/components/form/Button";
import * as Yup from "yup";
import { useState } from "react";
import { useFormik } from "formik";
import { errorToast, successToast } from "@/app/lib/toast";

import styles from "./BlogForm.module.css";
import { Textarea } from "@/app/(admin)/components/form/Textarea";
import { Select } from "@/app/(admin)/components/form/Select";
import { useRouter } from "next/navigation";
import { Category } from "@/app/types";

export default function BlogForm({ category }: { category: Category[] }) {
  const router = useRouter();

  const [editorContent, setEditorContent] = useState<any>(null);
  const [featuredFile, setFeaturedFile] = useState<File | null>(null);
  const categoryOptions = category.map((cat) => ({
    value: cat._id.toString(),
    label: cat.name,
  }));

  const blogSchema = Yup.object({
    title: Yup.string()
      .trim()
      .min(5, "Title must be at least 5 characters")
      .max(200, "Title is too long")
      .required("Title is required"),

    excerpt: Yup.string()
      .max(300, "Excerpt must be under 300 characters")
      .nullable(),

    categoryId: Yup.string().required("Category is required"),

    status: Yup.mixed<"draft" | "published">()
      .oneOf(["draft", "published"])
      .required(),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      excerpt: "",
      categoryId: "",
      status: "draft" as "draft" | "published",
    },
    validationSchema: blogSchema,
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

      if (featuredFile) {
        formData.append("featuredImage", featuredFile);
      }

      try {
        const res = await fetch("/api/blogs", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          errorToast("Failed to create blog");
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <Input
        label="Title"
        value={formik.values.title}
        required
        onChange={(e) => formik.setFieldValue("title", e.target.value)}
      />
      {formik.touched.title && formik.errors.title && (
        <p className={styles.error}>{formik.errors.title}</p>
      )}
      <Textarea
        label="Excerpt"
        value={formik.values.excerpt}
        onChange={(e) => formik.setFieldValue("excerpt", e.target.value)}
      />
      {formik.touched.excerpt && formik.errors.excerpt && (
        <p className={styles.error}>{formik.errors.excerpt}</p>
      )}
      <Select
        label="Category"
        value={formik.values.categoryId}
        onChange={(e) => formik.setFieldValue("categoryId", e.target.value)}
        options={categoryOptions}
      />
      {formik.touched.categoryId && formik.errors.categoryId && (
        <p className={styles.error}>{formik.errors.categoryId}</p>
      )}
      <Input
        label="Featured Image"
        type="file"
        value=""
        onChange={(e) => setFeaturedFile(e.target.files?.[0] || null)}
      />
      <Editor onChange={setEditorContent} />
      <div className={styles.actions}>
        <Button
          variant="secondary"
          onClick={() => formik.setFieldValue("status", "draft")}
          type="submit"
        >
          Save Draft
        </Button>

        <Button
          variant="primary"
          onClick={() => formik.setFieldValue("status", "published")}
          type="submit"
          disabled={formik.isSubmitting}
        >
          Publish
        </Button>
      </div>
    </form>
  );
}
