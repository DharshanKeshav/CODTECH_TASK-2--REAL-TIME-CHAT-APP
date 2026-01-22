import { useState } from "react";
import { X, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PrivateChatModalProps {
  open: boolean;
  onClose: () => void;
  onStartChat: (chatId: string) => void;
}

const PrivateChatModal = ({
  open,
  onClose,
  onStartChat,
}: PrivateChatModalProps) => {
  const [chatId, setChatId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatId.trim()) {
      onStartChat(chatId.trim());
      setChatId("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <div className="w-10 h-10 rounded-full bg-lightning/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-lightning" />
            </div>
            Start SnapSession
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              Enter Chat ID
            </label>
            <Input
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="Paste the user's Chat ID..."
              className="h-12 bg-input border-border focus:ring-2 focus:ring-lightning/50 focus:border-lightning"
            />
            <p className="text-xs text-muted-foreground">
              Ask your friend for their Chat ID to start a private conversation
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-lightning hover:opacity-90 text-accent-foreground gap-2"
              disabled={!chatId.trim()}
            >
              Connect
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PrivateChatModal;
