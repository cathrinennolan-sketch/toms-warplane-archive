import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tom's Warplane Archive | WWII Aviation Photography & Records",
  description: "A professional WWII aviation photography digital archive — thousands of wartime aircraft photographs, pilot biographies, and historical documents.",
  openGraph: {
    title: "Tom's Warplane Archive",
    description: "WWII Aviation Digital Archive",
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
      <body>
        <div className="archive-app-shell">
          <Sidebar />
          <div className="archive-main-viewport">
            <Header />
            <main className="archive-page-content">{children}</main>
            <Footer />
          </div>
        </div>
        <Toaster position="bottom-right" />

        <style>{`
          .archive-app-shell {
            display: flex;
            min-height: 100vh;
            background-color: var(--bg);
          }
          .archive-main-viewport {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-width: 0;
          }
          @media (min-width: 1024px) {
            .archive-main-viewport {
              margin-left: 270px;
            }
          }
          .archive-page-content {
            flex: 1;
          }
        `}</style>
      </body>
    </html>
  );
}
