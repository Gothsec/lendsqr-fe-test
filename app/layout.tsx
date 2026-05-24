import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.scss";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lendsqr Admin Console",
  description: "Admin dashboard for Lendsqr",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={workSans.className}>
      <body>{children}</body>
    </html>
  );
}
