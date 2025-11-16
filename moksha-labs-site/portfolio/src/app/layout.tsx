import type { Metadata } from "next";
import "./globals.css";
import { DevToolbar } from "@/components/dev/DevToolbar";

export const metadata: Metadata = {
  title: "Moksha Labs - Digital Experiences",
  description: "Where artistry meets code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          {children}
          <DevToolbar />
      </body>
    </html>
  );
}

