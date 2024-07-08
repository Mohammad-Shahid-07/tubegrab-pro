import { downloadVideo, getDownloadInfo, initiateDownload } from "@/helper";
import { Volume2, VolumeX, Download } from "lucide-react";
import { FC, useState } from "react";
import { Button } from "./ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { VideoFormat, VideoInfo } from "@/types";
import { formatFileSize } from "@/lib/utils";

interface FormatTableProps {
  formats: VideoFormat[];
  video: VideoInfo;
}

const FormatTable: FC<FormatTableProps> = ({ formats, video }) => {
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);

  const handleDownload = async (format: VideoFormat, index: number) => {
    setDownloadingIndex(index);
    try {
      downloadVideo(format, video.title);
    } catch (error) {
      console.error("Download failed:", error);
      // Handle error, e.g., show a notification to the user
    } finally {
      setDownloadingIndex(null);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Quality</TableHead>
          <TableHead>Format</TableHead>
          <TableHead>Audio</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {formats.map((format, formatIndex) => (
          <TableRow key={formatIndex}>
            <TableCell>{format.quality}</TableCell>
            <TableCell>{format.mimeType.split(";")[0]}</TableCell>
            <TableCell>
              {format.hasAudio ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </TableCell>
            <TableCell>{formatFileSize(format.contentLength)}</TableCell>
            <TableCell>
              <Button
                onClick={() => handleDownload(format, formatIndex)}
                disabled={downloadingIndex !== null}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {downloadingIndex === formatIndex ? "Preparing..." : "Download"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FormatTable;
