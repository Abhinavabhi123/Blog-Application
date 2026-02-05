import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="blog-container">{children}</main>
      <Footer />
    </>
  );
}
