import styles from "../Contact.module.css";

export default function ContactInfo() {
  return (
    <section className={styles.info}>
      <div>
        <h3>Where to Find Us</h3>
        <p>
          1600 Amphitheatre Parkway<br />
          Mountain View, CA<br />
          94043 US
        </p>
      </div>

      <div>
        <h3>Contact Info</h3>
        <p>contact@philosophywebsite.com</p>
        <p>info@philosophywebsite.com</p>
        <p>Phone: (+1) 123 456</p>
      </div>
    </section>
  );
}
