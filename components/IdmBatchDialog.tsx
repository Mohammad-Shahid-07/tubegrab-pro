import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DownloadIcon, ClipboardCopyIcon } from "lucide-react";
import { FunctionComponent } from "react";
import { Button } from "./ui/button";
import { DialogHeader } from "./ui/dialog";

interface IdmBatchDialogProps {
  batchDownloadLink: string;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
}

const IdmBatchDialog: FunctionComponent<IdmBatchDialogProps> = ({
  batchDownloadLink,
  showDialog,
  setShowDialog,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(batchDownloadLink);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="bg-black/50 drop-shadow-md  shadow-sm border-white/20 text-white p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Batch Download Links
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            Here are the first 5 links. Click the button below to copy all links
            to your clipboard.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 p-4 bg-gray-800 rounded-md text-sm truncate line-clamp-5">
          {batchDownloadLink}
        </div>
        <Button
          className="mt-4 flex items-center justify-center w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          onClick={handleCopy}
        >
          <ClipboardCopyIcon className="mr-2 h-5 w-5" />
          Copy All Links
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default IdmBatchDialog;
