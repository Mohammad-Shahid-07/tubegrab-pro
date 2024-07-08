// api/youtube.ts (NextJS API route)
import { NextResponse } from "next/server";
import ytdl from "ytdl-core";
import ytpl from "ytpl";

interface VideoFormat {
  itag: number;
  quality: string;
  mimeType: string;
  url: string;
  hasAudio: boolean;
  contentLength: number;
}

interface VideoInfo {
  title: string;
  formats: VideoFormat[];
  thumbnail: string;
  duration: string;
  uploadedAt: string;
  subscriberCount?: number;
  author: string;
  views: string;
  videoUrl: string;
}

interface PlaylistInfo {
  title: string;
  videos: VideoInfo[];
}

type DownloadInfo = VideoInfo | PlaylistInfo;

async function getVideoInfo(videoUrl: string): Promise<VideoInfo> {
  const info = await ytdl.getInfo(videoUrl);
  const formats = ytdl.filterFormats(
    info.formats,
    (format) => format.qualityLabel !== null || format.audioBitrate !== null,
  );

  const processedFormats: VideoFormat[] = formats.map((format) => ({
    itag: format.itag,
    quality:
      format.qualityLabel ||
      (format.audioBitrate ? `${format.audioBitrate}kbps` : "Unknown"),
    mimeType: format.mimeType || "unknown",
    url: format.url,
    hasAudio: format.hasAudio || false,
    contentLength: parseInt(format.contentLength) || 0,
  }));

  return {
    title: info.videoDetails.title,
    formats: processedFormats,
    thumbnail: info.videoDetails.thumbnails[0].url,
    duration: info.videoDetails.lengthSeconds,
    uploadedAt: info.videoDetails.uploadDate,
    subscriberCount: info.videoDetails.author.subscriber_count,
    author: info.videoDetails.author.name,
    views: info.videoDetails.viewCount,
    videoUrl: videoUrl,
  };
}

async function getPlaylistInfo(playlistId: string): Promise<PlaylistInfo> {
  const playlist = await ytpl(playlistId);
  console.log(playlist);
  
  const videoPromises = playlist.items
    .slice(0, 3) // Limit to first 5 videos for performance
    .map((item) => getVideoInfo(item.url));
  const videos = await Promise.all(videoPromises);
  return {
    title: playlist.title,
    videos,
  };
}

export async function POST(request: Request) {
  try {
    const { url } = (await request.json()) as { url: string };
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let result: DownloadInfo;
    if (ytdl.validateURL(url)) {
      result = await getVideoInfo(url);
    } else if (ytpl.validateID(url)) {
      result = await getPlaylistInfo(url);
    } else {
      throw new Error("Invalid URL");
    }

    console.log(result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in YouTube download API:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
