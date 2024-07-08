import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DownloadIcon } from "@radix-ui/react-icons";
import { VideoInfo } from "@/types";
import FormatTable from "./FormatTable";

interface DownloadDialogProps {
  video: VideoInfo;
}

const DownloadDialog: React.FC<DownloadDialogProps> = ({ video }) => {
  const videoFormats = video.formats.filter(
    (format) => !format.mimeType.startsWith("audio"),
  );
  const audioFormats = video.formats.filter((format) =>
    format.mimeType.startsWith("audio"),
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size={"sm"} className="mt-2 gap-2">
          Download Options <DownloadIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/50 drop-shadow-md shadow-sm border-white/20 text-white">
        <DialogHeader>
          <DialogTitle>Download Options</DialogTitle>
          <DialogDescription>
            Select the quality and format you want to download
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="video" className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-5 bg-[#27272a]">
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
          </TabsList>
          <TabsContent value="video">
            <FormatTable formats={videoFormats} video={video} />
          </TabsContent>
          <TabsContent value="audio">
            <FormatTable formats={audioFormats} video={video} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadDialog;
