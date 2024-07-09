"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Download } from "lucide-react";
import axios from "axios";
import VideoCard from "./VideoCard";
import { useSearchParams } from "next/navigation";
import { DownloadInfo } from "@/types";
import { addToHistory } from "@/helper";
import Playlist from "./Playlist";
import ErrorAlert from "./ErrorAlert";

const YouTubeDownloader: React.FC = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadInfo, setDownloadInfo] = useState<DownloadInfo | null>(null);

  const searchParams = useSearchParams();

  const loadFromHistory = (url: string) => {
    const savedHistory = localStorage.getItem("youtubeDownloadHistory");
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      const historyItem = history.find((item: any) => item.url === url);
      if (historyItem) {
        setDownloadInfo(historyItem.info);
      } else {
        handleDownload(url);
      }
    } else {
      handleDownload(url);
    }
  };

  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam) {
      setUrl(urlParam);
      loadFromHistory(urlParam);
    }
  }, [loadFromHistory]);

  const handleDownload = async (downloadUrl: string = url) => {
    if (!downloadUrl) setError("Please enter a valid YouTube URL");
    setError("");
    setLoading(true);
    setDownloadInfo(null);

    try {
      const response = await axios.post("/api/youtube", { url: downloadUrl });
      if (response.status !== 200) {
        throw new Error(response.data.error || "Download failed");
      }
      const info = response.data as DownloadInfo;
      setDownloadInfo(info);
      addToHistory(info, downloadUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during the download",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full max-w-2xl mx-auto text-white">
      <div className="max-w-6xl mx-auto pt-10 px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-500">
            TubeGrab Pro
          </h1>
          <p className="text-xl text-gray-300 mt-2">
            Download YouTube videos and playlists with ease
          </p>
        </div>
        <form className="flex gap-4 mb-6">
          <Input
            type="text"
            placeholder="Enter YouTube URL (video or playlist)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-grow"
          />
          <Button
            onClick={() => handleDownload(url)}
            disabled={loading}
            variant={"destructive"}
            className="bg-gradient-to-r from-red-500 to-yellow-500"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download
          </Button>
        </form>
        {error && <ErrorAlert title="Download Error" error={error} />}
        <div className="max-h-[60dvh] rounded-lg glass overflow-y-scroll custom-scrollbar">
          {downloadInfo &&
            ("videos" in downloadInfo ? (
              <Playlist playlist={downloadInfo} />
            ) : (
              <VideoCard key={downloadInfo.videoUrl} video={downloadInfo} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default YouTubeDownloader;
