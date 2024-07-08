"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Clock,
  Video,
  List,
  PlayCircle,
  Download,
  Search,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import Image from "next/image";
import { formatDuration, formatTimeAgo } from "@/lib/utils";

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
  thumbnail: string;
  duration: string;
  formats: VideoFormat[];
  uploadedAt: string;
  subscriberCount?: number;
  views: number;
  author: string;
  videoUrl: string;
}

interface PlaylistInfo {
  title: string;
  videos: VideoInfo[];
}

type DownloadInfo = VideoInfo | PlaylistInfo;

interface HistoryItem {
  id: string;
  title: string;
  type: "video" | "playlist";
  timestamp: number;
  url: string;
  info: DownloadInfo;
}

const RightSidebar: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const loadHistory = useCallback(() => {
    const savedHistory = localStorage.getItem("youtubeDownloadHistory");
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setHistory((prevHistory) => {
        if (JSON.stringify(prevHistory) !== JSON.stringify(parsedHistory)) {
          return parsedHistory;
        }
        return prevHistory;
      });
    }
  }, []);

  useEffect(() => {
    loadHistory();

    const intervalId = setInterval(loadHistory, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [loadHistory]);

  const clearHistory = useCallback((type: "video" | "playlist") => {
    setHistory((prevHistory) => {
      const updatedHistory = prevHistory.filter((item) => item.type !== type);
      localStorage.setItem(
        "youtubeDownloadHistory",
        JSON.stringify(updatedHistory),
      );
      return updatedHistory;
    });
  }, []);

  const renderEmptyState = (type: "video" | "playlist") => {
    const searchTerm =
      type === "video" ? "funny cat videos" : "top 10 songs playlist";
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      searchTerm,
    )}`;

    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Image
          src={"/empty.png"}
          height={40}
          width={40}
          alt="Empty"
          className="w-16 h-16 text-gray-400 mb-4"
        />
        <h3 className="text-lg font-semibold text-white mb-2">
          No {type}s in history
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Try searching for &rdquo;{searchTerm}&rdquo;
        </p>
        <a href={youtubeSearchUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="destructive" className="gap-2">
            <Search className="h-4 w-4" /> Start Searching on YouTube
          </Button>
        </a>
      </div>
    );
  };

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prevHistory) => {
      const updatedHistory = prevHistory.filter((item) => item.id !== id);
      localStorage.setItem(
        "youtubeDownloadHistory",
        JSON.stringify(updatedHistory),
      );
      return updatedHistory;
    });
  }, []);

  const renderHistoryList = (type: "video" | "playlist") => {
    const filteredHistory = history.filter((item) => item.type === type);

    if (filteredHistory.length === 0) {
      return renderEmptyState(type);
    }

    return (
      <div className="space-y-4">
        {filteredHistory.map((item) => (
          <Link
            href={`/?url=${encodeURIComponent(item.url)}`}
            key={item.id}
            target="_self"
            className="grid relative grid-cols-7 w-full gap-5 h-fit p-2 rounded-lg glass hover:bg-gray-600/20 transition-colors"
          >
            <div className="relative col-span-3 flex-grow group">
              <Image
                src={
                  type === "video"
                    ? (item.info as VideoInfo).thumbnail
                    : (item.info as PlaylistInfo).videos[0].thumbnail
                }
                alt={item.title}
                width={400}
                height={202}
                className="w-full h-full aspect-video object-cover rounded-xl transition-transform duration-300 group-hover:blur-sm"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Download className="h-12 w-12 text-white" />
              </div>
              <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                {type === "video"
                  ? formatDuration((item.info as VideoInfo).duration)
                  : `${(item.info as PlaylistInfo).videos.length} Videos`}
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-white line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {formatTimeAgo(item.timestamp)}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFromHistory(item.id);
                  }}
                  className="text-red-400 hover:text-red-500 hover:bg-transparent p-1.5 absolute bottom-0 right-2 ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <>
      <Button
        variant="default"
        size="sm"
        onClick={toggleSidebar}
        className={`fixed top-16 ${
          isOpen ? "right-[384px]" : "right-0"
        } z-50 transition-all duration-300 ease-in-out glass hover:bg-gray-700 text-white rounded-l-full rounded-r-none h-12 px-2`}
      >
        {isOpen ? (
          <ChevronRight className="h-6 w-6" />
        ) : (
          <ChevronLeft className="h-6 w-6" />
        )}
      </Button>
      <div
        className={`fixed top-0 right-0 z-40 h-full w-96 glass transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Clock className="mr-2" /> History
            </h2>
          </div>
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-600/20 rounded-lg p-1">
              <TabsTrigger
                value="videos"
                className="flex items-center justify-center"
              >
                <Video className="w-4 h-4 mr-2" /> Videos
              </TabsTrigger>
              <TabsTrigger
                value="playlists"
                className="flex items-center justify-center"
              >
                <List className="w-4 h-4 mr-2" /> Playlists
              </TabsTrigger>
            </TabsList>
            <TabsContent value="videos">
              {renderHistoryList("video")}
              {history.filter((item) => item.type === "video").length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => clearHistory("video")}
                  className="mt-6 w-full"
                >
                  Clear Video History
                </Button>
              )}
            </TabsContent>
            <TabsContent value="playlists">
              {renderHistoryList("playlist")}
              {history.filter((item) => item.type === "playlist").length >
                0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => clearHistory("playlist")}
                  className="mt-6 w-full"
                >
                  Clear Playlist History
                </Button>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
