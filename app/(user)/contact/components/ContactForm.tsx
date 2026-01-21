"use client";

import styles from "../Contact.module.css";

export default function ContactForm() {
  return (
    <section className={styles.form}>
      <h2>Say Hello.</h2>

      <input placeholder="Your Name" />
      <input placeholder="Your Email" />
      <input placeholder="Website" />
      <textarea placeholder="Your Message" />

      <button>SUBMIT</button>
    </section>
  );
}
