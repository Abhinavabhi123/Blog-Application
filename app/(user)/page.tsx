import Blogs from "./components/blogs/Blogs";
import { heroSlides } from "./components/constants";
import Header from "./components/Header/Header";
import HeroSection from "./components/Hero/HeroSection";

export default async function page() {
  // await new Promise((res) => setTimeout(res, 1000));
  return (
    <div>
      <Header />
      <HeroSection main={heroSlides.main} side={heroSlides.side} />
      <Blogs />
    </div>
  );
}
