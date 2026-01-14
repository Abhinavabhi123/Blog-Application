import styles from "./hero.module.css";
import HeroMainCard from "./HeroMainCard";
import HeroSideCard from "./HeroSideCard";
import { HeroPost } from "./types";

export default function HeroSection({
  main,
  side,
}: {
  main: HeroPost;
  side: HeroPost[];
}) {
  return (
    <section className={styles.wrapper}>
      <HeroMainCard post={main} />

      <div className={styles.side}>
        {side &&
          side.length > 0 &&
          side.map((post) => <HeroSideCard key={post.id} post={post} />)}
      </div>
    </section>
  );
}
