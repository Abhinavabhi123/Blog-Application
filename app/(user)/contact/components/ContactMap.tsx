import styles from "../Contact.module.css";

export default function ContactMap() {
  return (
    <div className={styles.map}>
      <iframe
        src="https://www.google.com/maps?q=Mountain+View+CA&output=embed"
        loading="lazy"
      />
    </div>
  );
}
