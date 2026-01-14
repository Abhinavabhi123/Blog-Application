"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

type Blog = {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  createdAt?: string;
};

export default function BlogsClient({
  initialBlogs,
}: {
  initialBlogs: Blog[];
}) {
  const router = useRouter();

  return (
    <Box p={4}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={600}>
          Blogs
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/admin/blogs/create")}
        >
          Create Blog
        </Button>
      </Box>

      {/* Blog Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Title</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Created</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {initialBlogs.length > 0 ? (
              initialBlogs.map((blog) => (
                <TableRow key={blog._id} hover>
                  <TableCell>{blog.title}</TableCell>
                  <TableCell>
                    {blog.status === "published" ? "Published" : "Draft"}
                  </TableCell>
                  <TableCell>
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No blogs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
