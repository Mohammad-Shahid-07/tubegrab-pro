export interface VideoFormat {
  itag: number;
  quality: string;
  mimeType: string;
  url: string;
  hasAudio: boolean;
  contentLength: number;
}

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  formats: VideoFormat[];
  uploadedAt: string;
  subscriberCount?: number;
  views: number;
  author: string;
  videoUrl: string;
}

export interface PlaylistInfo {
  title: string;
  videos: VideoInfo[];
}

export type DownloadInfo = VideoInfo | PlaylistInfo;
