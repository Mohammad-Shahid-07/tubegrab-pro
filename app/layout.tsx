import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TubeGrab Pro - YouTube Video and Playlist Downloader",
  description:
    "TubeGrab Pro is a powerful and user-friendly web application that allows users to easily download YouTube videos and playlists in various qualities. Built with Next.js and React, it offers a seamless experience for saving your favorite YouTube content for offline viewing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0f0f0f] max-h-screen`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
