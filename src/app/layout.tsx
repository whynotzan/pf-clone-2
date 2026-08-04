import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const overused = localFont({
  variable: "--font-overused",
  src: [
    { path: "../../public/fonts/overused-regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/overused-medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/overused-bold.otf", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Alessandro Zanatta / Graphic Designer",
  description: "Graphic Designer",
  icons: { icon: "/seo/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${overused.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
