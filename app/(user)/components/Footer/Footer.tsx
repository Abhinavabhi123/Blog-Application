import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <h4>Quick Links</h4>
          <p>Home</p>
          <p>Blog</p>
          <p>Contact</p>
        </div>

        <div>
          <h4>Archives</h4>
          <p>January 2018</p>
          <p>December 2017</p>
        </div>

        <div>
          <h4>Social</h4>
          <p>Facebook</p>
          <p>Instagram</p>
        </div>

        <div>
          <h4>Our Newsletter</h4>
          <input placeholder="Email Address" />
          <button>Send</button>
        </div>
      </div>
      <p className={styles.copy}>© Philosophy 2018</p>
    </footer>
  );
}
