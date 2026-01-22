import { useState } from "react";
import ChatSidebarRealtime from "./ChatSidebarRealtime";
import ChatAreaRealtime from "./ChatAreaRealtime";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const ChatAppRealtime = () => {
  const { profile } = useAuth();
  const { messages, users, crumbs, loading, sendMessage, sendCrumb, searchUserByChatId } =
    useRealtimeChat();

  const [activeChat, setActiveChat] = useState<{
    type: "public" | "private";
    targetUser?: string;
    targetId?: string;
    targetProfileId?: string;
  }>({ type: "public" });

  if (!profile) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-biscuit" />
      </div>
    );
  }

  const handleSendMessage = async (message: string) => {
    const isPrivate = activeChat.type === "private";
    const receiverId = isPrivate ? activeChat.targetProfileId : undefined;

    const result = await sendMessage(message, receiverId, isPrivate);
    if (result?.error) {
      toast.error("Failed to send message");
    }
  };

  const handleSendCrumb = async (status: string) => {
    const result = await sendCrumb(status);
    if (result?.error) {
      toast.error("Failed to share crumb");
    } else {
      toast.success("Crumb shared! 🍪");
    }
  };

  const handleStartPrivateChat = (profileId: string, username: string, chatId: string) => {
    setActiveChat({
      type: "private",
      targetUser: username,
      targetId: chatId,
      targetProfileId: profileId,
    });
    toast.success(`Private chat with ${username}`, {
      description: "Messages are now private 🔒",
    });
  };

  const handleSearchUser = async (chatId: string) => {
    const { data, error } = await searchUserByChatId(chatId);
    if (error || !data) {
      toast.error("User not found", {
        description: "Check the Chat ID and try again",
      });
      return;
    }

    if (data.id === profile.id) {
      toast.error("That's your own ID!", {
        description: "You can't start a chat with yourself",
      });
      return;
    }

    handleStartPrivateChat(data.id, data.username, data.chat_id);
  };

  const handleClosePrivate = () => {
    setActiveChat({ type: "public" });
  };

  // Transform messages for display
  const displayMessages = messages
    .filter((msg) => {
      if (activeChat.type === "public") {
        return !msg.is_private;
      }
      return (
        msg.is_private &&
        ((msg.sender_id === profile.id && msg.receiver_id === activeChat.targetProfileId) ||
          (msg.sender_id === activeChat.targetProfileId && msg.receiver_id === profile.id))
      );
    })
    .map((msg) => ({
      id: msg.id,
      message: msg.message,
      sender: msg.sender?.username || "Unknown",
      senderAvatar: msg.sender?.avatar || "",
      timestamp: new Date(msg.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: msg.sender_id === profile.id,
      isPrivate: msg.is_private,
    }));

  // Transform users for display
  const displayUsers = users.map((u) => ({
    id: u.id,
    username: u.username,
    avatar: u.avatar,
    chatId: u.chat_id,
    isOnline: u.is_online ?? false,
  }));

  // Transform crumbs for display
  const displayCrumbs = crumbs.map((c) => ({
    id: c.id,
    username: c.profile?.username || "Unknown",
    avatar: c.profile?.avatar || "",
    status: c.status,
    time: formatTimeAgo(new Date(c.created_at)),
  }));

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-biscuit" />
          <p className="text-muted-foreground">Loading SnapCrumb...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex bg-background overflow-hidden">
      <ChatSidebarRealtime
        currentUser={{
          username: profile.username,
          chatId: profile.chat_id,
          avatar: profile.avatar,
        }}
        users={displayUsers}
        crumbs={displayCrumbs}
        onStartPrivateChat={(userId, username, chatId) => {
          handleStartPrivateChat(userId, username, chatId);
        }}
        onSearchUser={handleSearchUser}
      />
      <ChatAreaRealtime
        messages={displayMessages}
        currentUser={{
          username: profile.username,
          avatar: profile.avatar,
        }}
        activeChat={activeChat}
        onSendMessage={handleSendMessage}
        onSendCrumb={handleSendCrumb}
        onClosePrivate={activeChat.type === "private" ? handleClosePrivate : undefined}
      />
    </div>
  );
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

export default ChatAppRealtime;
