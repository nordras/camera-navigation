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
      <head>
        <script
          src="https://cdn.jsdelivr.net/npm/fingerpose@0.1.0/dist/fingerpose.min.js"
          type="text/javascript"
        ></script>
        <script src="https://unpkg.com/@tensorflow/tfjs-core@3.7.0/dist/tf-core.js"></script>
        <script src="https://unpkg.com/@tensorflow/tfjs-converter@3.7.0/dist/tf-converter.js"></script>
        <script src="https://unpkg.com/@tensorflow/tfjs-backend-webgl@3.7.0/dist/tf-backend-webgl.js"></script>
        <script src="https://unpkg.com/@tensorflow-models/handpose@0.0.7/dist/handpose.js"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
