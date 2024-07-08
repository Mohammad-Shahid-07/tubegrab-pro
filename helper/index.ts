import { DownloadInfo, VideoFormat, VideoInfo } from "@/types";
import axios from "axios";

export const addToHistory = (info: DownloadInfo, url: string): void => {
  const historyItem = {
    id: Date.now().toString(),
    title: info.title,
    type: "videos" in info ? "playlist" : "video",
    timestamp: Date.now(),
    url: url,
    info: info,
  };

  const savedHistory = localStorage.getItem("youtubeDownloadHistory");
  const history = savedHistory ? (JSON.parse(savedHistory) as any[]) : [];
  const updatedHistory = [historyItem, ...history].slice(0, 50); // Keep only the last 50 items
  localStorage.setItem(
    "youtubeDownloadHistory",
    JSON.stringify(updatedHistory),
  );
};

export const getDownloadInfo = async (url: string): Promise<DownloadInfo> => {
  try {
    const response = await axios.post<DownloadInfo>("/api/download", { url });
    console.log("Download info:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting download info:", error);
    throw error;
  }
};

export const initiateDownload = (url: string, filename: string): void => {
  console.log("Downloading:", url, filename);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const downloadVideo = async (
  format: VideoFormat,
  title: string,
): Promise<void> => {
  const a = document.createElement("a");
  a.href = format.url;

  const sanitizedTitle = title
    .replace(/[^\w\s-]/gi, "")
    .trim()
    .replace(/\s+/g, "_");

  let extension = format.mimeType.includes("audio") ? "mp3" : "mp4";
  const fileName = `${sanitizedTitle}_${format.quality}.${extension}`;

  a.download = fileName;
  a.target = "_self";
  a.rel = "noopener noreferrer";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const downloadFile = async (
  videoUrl: string,
  filename: string,
): Promise<void> => {
  try {
    const response = await axios.post<{
      downloadLink: string;
      contentType: string;
    }>("/api/download", { url: videoUrl }, { responseType: "json" });
    const { downloadLink } = response.data;

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = downloadLink;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error("Download failed:", error);
  }
};

export const downloadAll = (
  videos: VideoInfo[],
  selectedQuality: string,
): string => {
  const batchFileContent = videos
    .map((video) => {
      const selectedFormat = video.formats.find(
        (format) => format.quality === selectedQuality,
      );
      if (!selectedFormat) {
        console.warn(
          `No format found for video ${video.title} with quality ${selectedQuality}`,
        );
        return null;
      }

      const { url } = selectedFormat;

      // Sanitize the filename
      const sanitizedTitle = video.title
        .replace(/[<>:"/\\|?*]/g, "")
        .replace(/\s+/g, "_")
        .substring(0, 200); // Limit filename length

      const filename = `${sanitizedTitle}_${selectedQuality}.mp4`;

      // Generate the batch file content in IDM format
      return `${url}\n output=${filename}\n`;
    })
    .filter((item): item is string => item !== null)
    .join("\n");

  return batchFileContent;
};
