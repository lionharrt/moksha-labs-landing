import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
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
        <Providers>
          {children}
          <DevToolbar />
        </Providers>
      </body>
    </html>
  );
}

