import RightSidebar from "@/components/RightSidebar";
import YouTubeDownloader from "@/components/YoutubeDownloader";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex">
      <div className="flex-grow">
        <YouTubeDownloader />
      </div>
      <RightSidebar />
    </div>
  );
}
