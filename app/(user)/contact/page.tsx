import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import ContactHero from "./components/ContactHero";
import ContactMap from "./components/ContactMap";
import ContactInfo from "./components/ContactInfo";
import ContactForm from "./components/ContactForm";

export default function ContactPage() {
  return (
    <>
      <Header />
      <ContactHero />
      <ContactMap />
      <ContactInfo />
      <ContactForm />
      <Footer />
    </>
  );
}
