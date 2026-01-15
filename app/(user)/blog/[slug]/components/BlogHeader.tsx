import Image from "next/image";
import styles from "../blog.module.css";

type Props = {
  title: string;
  publishedAt: string;
  image: string;
};

export default function BlogHeader({ title, publishedAt, image }: Props) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>

      <p className={styles.meta}>
        {new Date(publishedAt).toDateString()}
      </p>

      <div className={styles.featuredImage}>
        <Image
          src={image}
          alt={title}
          width={900}
          height={450}
          priority
        />
      </div>
    </header>
  );
}
