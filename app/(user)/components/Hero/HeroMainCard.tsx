import Image from "next/image";
import styles from "./hero.module.css";
import { HeroPost } from "./types";

export default function HeroMainCard({ post }:{post:HeroPost}) {
  return (
    <article className={styles.mainCard}>
      <Image
        src={post.image}
        alt={post.title}
        fill
        loading="lazy"
        className={styles.image}
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      <div className={styles.overlay} />

      <div className={styles.content}>
        <span className={styles.tag}>{post.category}</span>
        <h1>{post.title}</h1>

        <div className={styles.meta}>
          <span>{post.author}</span>
          <span>•</span>
          <span>{post.date}</span>
        </div>
      </div>
    </article>
  );
}
