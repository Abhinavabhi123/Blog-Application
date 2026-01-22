"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "../Blogs.module.css";
import Image from "next/image";
import Link from "next/link";
import Input from "../../components/Form/Input/Input";
import Select from "../../components/Form/Select/Select";
import { Category } from "@/app/types";

type Option = {
  value: string;
  label: string;
};

export default function BlogGrid({
  blogs,
  categories,
  search,
  selectedCategory,
}: any) {
  const router = useRouter();
  const params = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(params.toString());
    value ? newParams.set(key, value) : newParams.delete(key);
    router.push(`?${newParams.toString()}`);
  };

  const categoryOptions: Option[] = categories.map((category: Category) => ({
    value: category.name.toLowerCase(),
    label: category.name.toLowerCase(),
  }));

  return (
    <>
      {/* SEARCH + FILTER */}
      <div className={styles.filters}>
        <Input
          type="text"
          defaultValue={search}
          placeholder="Search blogs..."
          onChange={(e) => updateParam("q", e.target.value)}
        />

        <Select
          value={selectedCategory}
          options={categoryOptions}
          onChange={(e) => updateParam("cat", e.target.value)}
        />
      </div>

      {/* GRID */}
      <div className={styles.grid}>
        {blogs.map((blog: any) => (
          <article key={blog._id} className={styles.card}>
            <Image
              src={blog.featuredImage?.medium || "/placeholder.jpg"}
              alt={blog.title}
              width={400}
              height={250}
            />

            <div className={styles.cardBody}>
              <h3>{blog.title}</h3>
              <p>{blog.excerpt}</p>
              <Link href={`/blog/${blog.slug}`}>Read More →</Link>
            </div>
          </article>
        ))}
      </div>

      {blogs.length === 0 && <p className={styles.empty}>No blogs found.</p>}
    </>
  );
}
