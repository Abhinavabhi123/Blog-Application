import { heroSlides } from "./components/constants";
import Header from "./components/Header/Header";
import HeroSection from "./components/Hero/HeroSection";

export default function page() {
  return (
    <div>
      <Header />
      <HeroSection main={heroSlides.main} side={heroSlides.side} />
    </div>
  );
}
