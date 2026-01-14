"use client";

import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  IconButton,
  Tooltip,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useMemo, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Category } from "../../../../types";
import { errorToast, successToast } from "@/app/lib/toast";
import { IoTrashOutline } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import swal from "sweetalert";

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function CategoriesClient({
  initialCategories,
  initialTotal,
  initialPage,
  limit,
}: {
  initialCategories: Category[];
  initialTotal: number;
  initialPage: number;
  limit: number;
}) {
  const [categories, setCategories] = useState<Category[]>([
    ...initialCategories,
  ]);
  const [page, setPage] = useState(initialPage - 1); // MUI uses 0-based index
  const [rowsPerPage, setRowsPerPage] = useState(limit);
  const [total, setTotal] = useState(initialTotal);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [open, setOpen] = useState(false);

  const categorySchema = Yup.object({
    name: Yup.string()
      .trim()
      .min(2, "Category name must be at least 2 characters")
      .max(50, "Category name must be less than 50 characters")
      .required("Category name is required"),
  });

  const filteredCategories = useMemo(() => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }, [categories, search, sortAsc]);

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: categorySchema,
    validateOnMount: false,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const res = await fetch("/api/categories", {
          method: "POST",
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (!res.ok && data.success) {
          return console.error("Error while creating the category");
        }
        successToast(data?.massage || "Category created");
        resetForm();
        setOpen(false);
        setCategories((prev) => [...prev, data.category]);
      } catch (error) {
        console.log("error while creating category", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fetchCategories = async (pageIndex: number, limit: number) => {
    try {
      const res = await fetch(
        `/api/categories?page=${pageIndex + 1}&limit=${limit}`
      );

      const data = await res.json();

      if (!res.ok) {
        errorToast("Failed to load categories");
        return;
      }

      setCategories(data.categories);
      setTotal(data.total);
    } catch {
      errorToast("Something went wrong");
    }
  };

  const deleteCategory = (id: string) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this category and related details!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const res = await fetch(`/api/categories/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (!res.ok) {
          errorToast(data.message || "Delete failed");
          return;
        }
        if (data.success && data.categoryId) {
          successToast(data.message || "Category deleted");
          setCategories((prev) =>
            prev.filter((cat) => cat._id !== data.categoryId)
          );
        }
      }
    });
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
    fetchCategories(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newLimit = parseInt(event.target.value, 10);
    setRowsPerPage(newLimit);
    setPage(0);
    fetchCategories(0, newLimit);
  };

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
          Categories
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Create Category
        </Button>
      </Box>
      <Box display="flex" gap={2} mb={3}>
        <TextField
          fullWidth
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Button
          sx={{ minWidth: 100 }}
          variant="outlined"
          onClick={() => setSortAsc((prev) => !prev)}
        >
          Sort {sortAsc ? "A–Z" : "Z–A"}
        </Button>
      </Box>

      {/* Category Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Si No.</strong>
              </TableCell>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Slug</strong>
              </TableCell>
              <TableCell>
                <strong>Actions </strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredCategories &&
              filteredCategories.length > 0 &&
              filteredCategories.map((cat, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.slug}</TableCell>
                  <TableCell>
                    <Box>
                      <Tooltip title="Edit" arrow>
                        <IconButton>
                          <MdOutlineEdit size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <IconButton onClick={() => deleteCategory(cat._id)}>
                          <IoTrashOutline size={18} color="red" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

            {filteredCategories.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      {/* Create Category Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2}>
            Create Category
          </Typography>

          <form onSubmit={formik.handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Category Name"
              name="name"
              margin="normal"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
              <Button
                onClick={() => {
                  formik.resetForm();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Creating.." : " Create"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}
