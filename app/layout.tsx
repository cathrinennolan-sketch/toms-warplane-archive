import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tom's Warplane Archive | WWII Aviation Photography",
  description: "A professional WWII aviation photography archive — thousands of wartime aircraft photographs, pilot biographies, and historical documents.",
  openGraph: {
    title: "Tom's Warplane Archive",
    description: "WWII Aviation Photography Archive",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-textured">
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
