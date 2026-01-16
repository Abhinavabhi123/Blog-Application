"use client";

import { useState } from "react";
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
  TablePagination,
  TextField,
  TableSortLabel,
  Tooltip,
  IconButton,
} from "@mui/material";
import { MdOutlineEdit } from "react-icons/md";
import { IoTrashOutline } from "react-icons/io5";
import swal from "sweetalert";
import { errorToast, successToast } from "@/app/lib/toast";

type Blog = {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  createdAt?: string;
};

type Order = "asc" | "desc";

export default function BlogsClient({
  initialBlogs,
  initialTotal,
}: {
  initialBlogs: Blog[];
  initialTotal: number;
}) {
  const router = useRouter();

  const [blogs, setBlogs] = useState(initialBlogs);
  const [total, setTotal] = useState(initialTotal);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<"title" | "createdAt">("createdAt");
  const [order, setOrder] = useState<Order>("desc");
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async (
    pageNumber = page,
    limit = rowsPerPage,
    query = search,
    sortField = orderBy,
    sortOrder = order
  ) => {
    setLoading(true);

    const params = new URLSearchParams({
      page: String(pageNumber + 1),
      limit: String(limit),
      search: query,
      sortBy: sortField,
      sortOrder,
    });

    const res = await fetch(`/api/admin/blogs?${params.toString()}`);
    const data = await res.json();

    setBlogs(data.blogs);
    setTotal(data.total);
    setLoading(false);
  };

  const handleSort = (property: "title" | "createdAt") => {
    const isAsc = orderBy === property && order === "asc";
    const newOrder = isAsc ? "desc" : "asc";

    setOrder(newOrder);
    setOrderBy(property);
    fetchBlogs(page, rowsPerPage, search, property, newOrder);
  };

  const handleSearch = () => {
    setPage(0);
    fetchBlogs(0, rowsPerPage, search);
  };

  // delete blog
  const deleteBlog = (id: string) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this category and related details!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const res = await fetch(`/api/admin/blogs/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) {
            return errorToast("Something issue while deleting the blog");
          }
          successToast("Blog deleted successfully");
          setBlogs((prev) => prev.filter((blog) => blog._id !== id));
        } catch (error) {
          console.log("Error while deleting the blog", error);
        }
      }
    });
  };

  return (
    <Box p={4}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Blogs
        </Typography>

        <Button
          variant="contained"
          onClick={() => router.push("/admin/blogs/create")}
        >
          Create Blog
        </Button>
      </Box>

      {/* 🔍 Search */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Search blogs"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          sx={{ width: "100%" }}
        />
        <Button variant="outlined" onClick={handleSearch}>
          Search
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setSearch("");
            setPage(0);
            fetchBlogs(0, rowsPerPage, "", orderBy, order);
          }}
        >
          Clear
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>#</strong>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === "title"}
                  direction={orderBy === "title" ? order : "asc"}
                  onClick={() => handleSort("title")}
                >
                  Title
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <strong>Status</strong>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === "createdAt"}
                  direction={orderBy === "createdAt" ? order : "asc"}
                  onClick={() => handleSort("createdAt")}
                >
                  Created
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {blogs.length ? (
              blogs.map((blog, index) => (
                <TableRow key={blog._id} hover>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{blog.title}</TableCell>
                  <TableCell>
                    {blog.status === "published" ? "Published" : "Draft"}
                  </TableCell>
                  <TableCell>
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          onClick={() =>
                            router.push(`/admin/blogs/edit/${blog._id}`)
                          }
                        >
                          <MdOutlineEdit color="blue" size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <IconButton onClick={() => deleteBlog(blog._id)}>
                          <IoTrashOutline color="red" size={18} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {loading ? "Loading..." : "No blogs found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => {
            setPage(newPage);
            fetchBlogs(newPage);
          }}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            const newLimit = parseInt(e.target.value, 10);
            setRowsPerPage(newLimit);
            setPage(0);
            fetchBlogs(0, newLimit);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </Box>
  );
}
