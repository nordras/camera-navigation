import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Camera Navigation - Gesture Detection",
  description: "Hand gesture detection using TensorFlow.js and Handpose",
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
