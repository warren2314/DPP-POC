import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAP Fioneer Privacy Assessment Workspace",
  description: "Corporate privacy and data protection assessment workflow for SAP Fioneer product governance.",
  icons: {
    icon: "https://www.sapfioneer.com/wp-content/uploads/2025/06/cropped-sap-fioneer-favicon-512x512-1-32x32.png",
    apple: "https://www.sapfioneer.com/wp-content/uploads/2025/06/cropped-sap-fioneer-favicon-512x512-1-180x180.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
