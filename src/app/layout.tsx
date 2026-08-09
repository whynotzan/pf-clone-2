import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const overused = localFont({
  variable: "--font-overused",
  src: [
    { path: "../../public/fonts/overused-regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/overused-medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/overused-bold.otf", weight: "700", style: "normal" },
  ],
});

const title = "Alessandro Zanatta / Graphic Designer";
const description =
  "Graphic designer based in Treviso, Italy. Brand and visual identity, editorial and motion design.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: title, template: "%s / Alessandro Zanatta" },
  description,
  icons: { icon: "/seo/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "Alessandro Zanatta",
    title,
    description,
    url: "/",
    // NOTE: this asset is only 300x209. It is above the minimum every network
    // accepts, so previews work, but it is well below the 1200x630 they render
    // at — see docs/ROADMAP.md Phase 5. Update the dimensions when it is replaced.
    images: [{ url: "/seo/og-image.jpeg", width: 300, height: 209, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/seo/og-image.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${overused.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <div className="grain-overlay" aria-hidden />
      </body>
    </html>
  );
}
