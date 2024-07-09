import RightSidebar from "@/components/RightSidebar";
import YouTubeDownloader from "@/components/YoutubeDownloader";
import Image from "next/image";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="flex">
      <div className="flex-grow">
      <Suspense fallback={<div>Loading...</div>}>
        <YouTubeDownloader />
        </Suspense>
      </div>
      <RightSidebar />
    </div>
  );
}
