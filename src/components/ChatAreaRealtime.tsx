import { useState, useRef, useEffect } from "react";
import { Send, Hash, Lock, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatBubble from "./ChatBubble";

interface Message {
  id: string;
  message: string;
  sender: string;
  senderAvatar: string;
  timestamp: string;
  isOwn: boolean;
  isPrivate: boolean;
}

interface ChatAreaRealtimeProps {
  messages: Message[];
  currentUser: {
    username: string;
    avatar: string;
  };
  activeChat: {
    type: "public" | "private";
    targetUser?: string;
    targetId?: string;
  };
  onSendMessage: (message: string) => void;
  onSendCrumb: (status: string) => void;
  onClosePrivate?: () => void;
}

const ChatAreaRealtime = ({
  messages,
  currentUser,
  activeChat,
  onSendMessage,
  onSendCrumb,
  onClosePrivate,
}: ChatAreaRealtimeProps) => {
  const [message, setMessage] = useState("");
  const [crumb, setCrumb] = useState("");
  const [showCrumbInput, setShowCrumbInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleCrumbSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (crumb.trim()) {
      onSendCrumb(crumb.trim());
      setCrumb("");
      setShowCrumbInput(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background h-full">
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50">
        <div className="flex items-center gap-3">
          {activeChat.type === "public" ? (
            <>
              <div className="w-10 h-10 rounded-full bg-biscuit/20 flex items-center justify-center">
                <Hash className="w-5 h-5 text-biscuit" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Public Chat</h2>
                <p className="text-xs text-muted-foreground">
                  Everyone can see messages here
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-lightning/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-lightning" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">
                  {activeChat.targetUser}
                </h2>
                <p className="text-xs text-lightning">Private SnapSession 🔒</p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeChat.type === "private" && onClosePrivate && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onClosePrivate}
              className="hover:bg-destructive/20 hover:text-destructive"
              title="Close private chat"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowCrumbInput(!showCrumbInput)}
            className="gap-2 border-biscuit/30 hover:bg-biscuit/10 hover:text-biscuit"
          >
            <Sparkles className="w-4 h-4" />
            Post Crumb
          </Button>
        </div>
      </div>

      {/* Crumb Input */}
      {showCrumbInput && (
        <div className="p-4 bg-secondary/30 border-b border-border animate-fade-in">
          <form onSubmit={handleCrumbSubmit} className="flex gap-2">
            <Input
              value={crumb}
              onChange={(e) => setCrumb(e.target.value)}
              placeholder="What's on your mind? Share a crumb..."
              className="flex-1 bg-input border-biscuit/30 focus:ring-biscuit/50"
              maxLength={100}
            />
            <Button
              type="submit"
              className="btn-biscuit"
              disabled={!crumb.trim()}
            >
              Share
            </Button>
          </form>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <div className="w-20 h-20 rounded-full bg-biscuit/10 flex items-center justify-center mb-4">
              {activeChat.type === "public" ? (
                <Hash className="w-10 h-10 text-biscuit/50" />
              ) : (
                <Lock className="w-10 h-10 text-lightning/50" />
              )}
            </div>
            <p className="text-lg font-medium">
              {activeChat.type === "public"
                ? "No messages yet"
                : `Start chatting with ${activeChat.targetUser}`}
            </p>
            <p className="text-sm">
              {activeChat.type === "public"
                ? "Be the first to break the ice! 🍪"
                : "Your messages are private 🔒"}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg.message}
              sender={msg.sender}
              senderAvatar={msg.senderAvatar}
              timestamp={msg.timestamp}
              isOwn={msg.isOwn}
              isPrivate={msg.isPrivate}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card/30">
        <form onSubmit={handleSend} className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                activeChat.type === "public"
                  ? "Type a message..."
                  : `Message ${activeChat.targetUser}...`
              }
              className="h-12 bg-input border-border pr-12 focus:ring-2 focus:ring-biscuit/50"
            />
          </div>
          <Button
            type="submit"
            size="icon"
            className="h-12 w-12 btn-biscuit rounded-xl"
            disabled={!message.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatAreaRealtime;
