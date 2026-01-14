import { Gabriela, Inter } from "next/font/google";

export const gabriela = Gabriela({
  subsets: ["latin"],
  weight: "400", // Gabriela has only 400
  display: "swap",
  variable: "--font-gabriela",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});
