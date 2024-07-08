import { PlaylistInfo } from "@/types";
import { Checkbox } from "@radix-ui/react-checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Download, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import VideoCard from "./VideoCard";
import { downloadAll } from "@/helper";
import { useState } from "react";

import React from "react";
import IdmBatchDialog from "./IdmBatchDialog";
interface PlaylistProps {
  playlist: PlaylistInfo;
}

const Playlist: React.FC<PlaylistProps> = ({ playlist }) => {
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [addSuffix, setAddSuffix] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [batchFileContent, setBatchFileContent] = useState<string | null>(null);

  const handleDownload = () => {
    const batchFileContent = downloadAll(
      playlist.videos,
      selectedQuality as string,
    );
    if (batchFileContent) {
      setBatchFileContent(batchFileContent);
      setShowDialog(true);
    }
  };
  const uniqueQualities = Array.from(
    new Set(playlist.videos[0].formats.map((f) => f.quality)),
  );

  return (
    <div className="bg-none p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{playlist.title}</h2>
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <Select onValueChange={(value) => setSelectedQuality(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select quality" />
          </SelectTrigger>
          <SelectContent>
            {uniqueQualities.map((quality) => {
              const formatWithAudio = playlist.videos[0].formats.find(
                (f) => f.quality === quality && f.hasAudio,
              );

              return (
                <SelectItem
                  key={quality}
                  value={quality}
                  className="flex w-full justify-between items-center px-4 py-2 hover:bg-gray-700/5 transition-colors duration-150"
                >
                  <span className="ml-2">
                    {formatWithAudio ? (
                      <Volume2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <VolumeX className="h-4 w-4 text-red-500" />
                    )}
                  </span>
                  <span className="gap-2">{quality}</span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Button
          onClick={() => handleDownload()}
          disabled={!selectedQuality}
          className="bg-red-600 hover:bg-red-700 h-9"
        >
          <Download className="mr-2 h-4 w-4" />
          Download All With IDM
        </Button>
      </div>
      <div className="space-y-2.5">
        {playlist.videos.map((video, index) => (
          <VideoCard key={video.videoUrl} video={video} />
        ))}
      </div>
      {batchFileContent && (
        <IdmBatchDialog
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          batchDownloadLink={batchFileContent}
        />
      )}
    </div>
  );
};

export default Playlist;
