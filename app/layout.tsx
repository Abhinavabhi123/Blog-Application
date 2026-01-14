import "./globals.css";
import { gabriela, inter } from "./fonts";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${gabriela.variable} ${inter.variable}`}>
        <Toaster richColors position="top-right" />
        <NextTopLoader color="#0ea5e9" height={3} showSpinner={false} />
        {children}
      </body>
    </html>
  );
}
