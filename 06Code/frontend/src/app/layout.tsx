import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Artisan Shop",
  description: "Handcrafted artisan products — Code & Coffee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
