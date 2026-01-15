import Image from "next/image";
import Link from "next/link";
import styles from "./BlogGrid.module.css";
import PlaceHolderImage from "../../../../public/images/placeholder.webp";

type Blog = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  createdAt?: string;
  featuredImage?: {
    medium?: string;
  };
};

export default function BlogGrid({ blogs }: { blogs: Blog[] }) {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {blogs.map((blog) => {
          const imageSrc = blog.featuredImage?.medium || PlaceHolderImage;

          return (
            <article key={blog._id} className={styles.card}>
              {/* Image */}
              <Link
                href={`/blogs/${blog.slug}`}
                className={styles.imageWrapper}
              >
                <Image
                  src={imageSrc}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={styles.image}
                />
              </Link>

              {/* Content */}
              <div className={styles.content}>
                {blog.createdAt && (
                  <time className={styles.date} dateTime={blog.createdAt}>
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </time>
                )}

                <h2 className={styles.title}>
                  <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                </h2>

                {blog.excerpt && (
                  <p className={styles.excerpt}>{blog.excerpt}</p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
