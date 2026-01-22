import { Copy } from "lucide-react";
import { toast } from "sonner";

interface ChatBubbleProps {
  message: string;
  sender: string;
  senderAvatar: string;
  timestamp: string;
  isOwn: boolean;
  isPrivate?: boolean;
}

const ChatBubble = ({
  message,
  sender,
  senderAvatar,
  timestamp,
  isOwn,
  isPrivate = false,
}: ChatBubbleProps) => {
  return (
    <div
      className={`flex gap-3 animate-message-in ${
        isOwn ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <img
        src={senderAvatar}
        alt={sender}
        className="w-10 h-10 rounded-full ring-2 ring-biscuit/30 flex-shrink-0"
      />

      {/* Message Content */}
      <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
        {/* Sender Name */}
        <div
          className={`flex items-center gap-2 mb-1 ${
            isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <span className="text-xs font-semibold text-muted-foreground">
            {isOwn ? "You" : sender}
          </span>
          {isPrivate && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-lightning/20 text-lightning font-semibold">
              Private
            </span>
          )}
        </div>

        {/* Bubble */}
        <div
          className={`${isOwn ? "bubble-own" : "bubble-other"} ${
            isPrivate ? "ring-1 ring-lightning/30" : ""
          }`}
        >
          <p className="text-foreground text-sm leading-relaxed py-1 px-1">
            {message}
          </p>
        </div>

        {/* Timestamp */}
        <p
          className={`text-[10px] text-muted-foreground/60 mt-1 ${
            isOwn ? "text-right" : "text-left"
          }`}
        >
          {timestamp}
        </p>
      </div>
    </div>
  );
};

export default ChatBubble;
