"use client";

import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Editor from "../components/Editor";
import { successToast, errorToast } from "@/app/lib/toast";

export default function CreateBlogPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState<any>(null);
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [featuredFile, setFeaturedFile] = useState<File | null>(null);

  // Auto-generate slug
  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    );
  };

  const handleSubmit = async () => {
    if (!title || !slug || !content || !categoryId) {
      errorToast("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("excerpt", excerpt);
    formData.append("content", JSON.stringify(content));
    formData.append("category", categoryId);
    formData.append("status", status);

    if (featuredFile) {
      formData.append("featuredImage", featuredFile);
    }

    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        errorToast(data.message || "Failed to create blog");
        return;
      }

      successToast("Blog created successfully");
      router.push("/admin/blogs");
    } catch (error) {
      errorToast("Something went wrong");
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={3}>
        Create Blog
      </Typography>

      {/* Title */}
      <TextField
        fullWidth
        label="Blog Title"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* Slug */}
      <TextField
        fullWidth
        label="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* Excerpt */}
      <TextField
        fullWidth
        label="Excerpt"
        multiline
        rows={3}
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* Category (TEMP input – replace with Select later) */}
      <TextField
        fullWidth
        label="Category ID"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* Featured Image */}
      <Box mb={3}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFeaturedFile(e.target.files?.[0] || null)}
        />
      </Box>

      {/* Editor */}
      <Editor onChange={setContent} />

      {/* Actions */}
      <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" onClick={() => setStatus("draft")}>
          Save Draft
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setStatus("published");
            handleSubmit();
          }}
        >
          Publish
        </Button>
      </Box>
    </Box>
  );
}
