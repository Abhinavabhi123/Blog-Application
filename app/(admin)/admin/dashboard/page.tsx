import styles from "./dashboard.module.css";

export default function Page() {
  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>

      <div className={styles.cards}>
        <div className={styles.card}>
          <span>Total Users</span>
          <strong>1,245</strong>
        </div>

        <div className={styles.card}>
          <span>Total Posts</span>
          <strong>328</strong>
        </div>

        <div className={styles.card}>
          <span>Categories</span>
          <strong>18</strong>
        </div>

        <div className={styles.card}>
          <span>Active Admins</span>
          <strong>3</strong>
        </div>
      </div>
    </div>
  );
}
