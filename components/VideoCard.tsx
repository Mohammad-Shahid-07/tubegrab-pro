import React from "react";
import Image from "next/image";
import { formatDuration, formatViews, formatTimeAgo } from "@/lib/utils";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import DownloadDialog from "./DownloadDialoge";
import { VideoInfo } from "@/types";

interface VideoCardProps {
  video: VideoInfo;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => (
  <div className="grid grid-cols-6 w-full max-w-[650px] gap-5 p-4 rounded-lg">
    <Link
      href={video.videoUrl}
      target="_blank"
      className="relative col-span-2 flex-grow group"
    >
      <Image
        src={video.thumbnail}
        alt={video.title}
        width={400}
        height={202}
        className="w-full h-full aspect-video object-cover rounded-xl transition-transform duration-300 group-hover:blur-sm"
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <PlayCircle className="h-12 w-12 text-white" />
      </div>
      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
        {formatDuration(video.duration)}
      </div>
    </Link>
    <div className="mt col-span-4">
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold line-clamp-2">{video.title}</h3>
        <p className="text-xs text-gray-400 mt-1">{video.author}</p>
        <p className="text-xs text-gray-400">
          {formatViews(video.views)} • {formatTimeAgo(video.uploadedAt)}
        </p>
      </div>
      <DownloadDialog video={video} />
    </div>
  </div>
);

export default VideoCard;
