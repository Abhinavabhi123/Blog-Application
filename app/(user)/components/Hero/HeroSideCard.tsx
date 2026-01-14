import Image from "next/image";
import styles from "./hero.module.css";

export default function HeroSideCard({ post }) {
  return (
    <article className={styles.sideCard}>
      <Image
        src={post.image}
        alt={post.title}
        fill
        className={styles.image}
        sizes="(max-width: 768px) 100vw, 50vw"
        loading="lazy"
      />
      <div className={styles.overlay} />

      <div className={styles.content}>
        <span className={styles.tagSmall}>{post.category}</span>
        <h3>{post.title}</h3>

        <p className={styles.meta}>
          {post.author} • {post.date}
        </p>
      </div>
    </article>
  );
}
