"use client";

import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./login.module.css";
import { successToast } from "@/app/lib/toast";

export default function AdminLoginPage() {
  const router = useRouter();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, setStatus }: any
  ) => {
    setStatus(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus(data.message || "Login failed");
      setSubmitting(false);
      return;
    }
    successToast(data?.message || "Admin Login successful");

    router.push("/admin/dashboard");
  };

  return (
    <div className={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className={styles.form}>
            <h1>Admin Login</h1>

            {/* Email */}
            <div>
              <Field
                type="email"
                name="email"
                placeholder="Admin Email"
                className={styles.input}
              />
              <ErrorMessage
                name="email"
                component="p"
                className={styles.error}
              />
            </div>

            {/* Password */}
            <div>
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className={styles.input}
              />
              <ErrorMessage
                name="password"
                component="p"
                className={styles.error}
              />
            </div>

            {/* API Error */}
            {status && <p className={styles.error}>{status}</p>}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
