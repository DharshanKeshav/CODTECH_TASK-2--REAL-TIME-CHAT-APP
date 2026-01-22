import { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatArea from "./ChatArea";
import PrivateChatModal from "./PrivateChatModal";
import { toast } from "sonner";

interface ChatAppProps {
  currentUser: {
    username: string;
    chatId: string;
    avatar: string;
  };
}

// Mock data for demonstration
const mockUsers = [
  {
    id: "usr_abc123def456",
    username: "CookieMonster",
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=CookieMonster",
    isOnline: true,
  },
  {
    id: "usr_ghi789jkl012",
    username: "BiscuitBandit",
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=BiscuitBandit",
    isOnline: true,
  },
  {
    id: "usr_mno345pqr678",
    username: "CrumbCatcher",
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=CrumbCatcher",
    isOnline: false,
  },
];

const mockCrumbs = [
  {
    id: "crumb_1",
    username: "CookieMonster",
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=CookieMonster",
    status: "Just baked a fresh batch of chocolate chip cookies! 🍪",
    time: "5 min ago",
  },
  {
    id: "crumb_2",
    username: "BiscuitBandit",
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=BiscuitBandit",
    status: "Crushing it at work today ⚡",
    time: "12 min ago",
  },
];

const ChatApp = ({ currentUser }: ChatAppProps) => {
  const [messages, setMessages] = useState<any[]>([
    {
      id: "msg_1",
      message: "Welcome to SnapCrumb! 🍪⚡ Start chatting and share your crumbs!",
      sender: "System",
      senderAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=snapcrumb",
      timestamp: "Just now",
      isOwn: false,
      isPrivate: false,
    },
  ]);
  const [activeChat, setActiveChat] = useState<{
    type: "public" | "private";
    targetUser?: string;
    targetId?: string;
  }>({ type: "public" });
  const [showPrivateModal, setShowPrivateModal] = useState(false);
  const [crumbs, setCrumbs] = useState(mockCrumbs);

  const handleSendMessage = (message: string) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      message,
      sender: currentUser.username,
      senderAvatar: currentUser.avatar,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
      isPrivate: activeChat.type === "private",
    };
    setMessages([...messages, newMessage]);
  };

  const handleSendCrumb = (status: string) => {
    const newCrumb = {
      id: `crumb_${Date.now()}`,
      username: currentUser.username,
      avatar: currentUser.avatar,
      status,
      time: "Just now",
    };
    setCrumbs([newCrumb, ...crumbs]);
  };

  const handleStartPrivateChat = (chatId: string, username: string) => {
    setActiveChat({
      type: "private",
      targetUser: username,
      targetId: chatId,
    });
    toast.success(`Private chat with ${username}`, {
      description: "Messages are now end-to-end encrypted 🔒",
    });
  };

  const handleStartPrivateChatById = (chatId: string) => {
    const user = mockUsers.find((u) => u.id === chatId);
    if (user) {
      handleStartPrivateChat(chatId, user.username);
    } else {
      // For demo, create a placeholder
      setActiveChat({
        type: "private",
        targetUser: `User ${chatId.slice(0, 8)}`,
        targetId: chatId,
      });
    }
    setShowPrivateModal(false);
  };

  const handleClosePrivate = () => {
    setActiveChat({ type: "public" });
  };

  return (
    <div className="h-screen w-full flex bg-background overflow-hidden">
      <ChatSidebar
        currentUser={currentUser}
        users={mockUsers}
        crumbs={crumbs}
        onStartPrivateChat={handleStartPrivateChat}
      />
      <ChatArea
        messages={messages.filter(
          (msg) =>
            activeChat.type === "public"
              ? !msg.isPrivate
              : msg.isPrivate || msg.sender === "System"
        )}
        currentUser={currentUser}
        activeChat={activeChat}
        onSendMessage={handleSendMessage}
        onSendCrumb={handleSendCrumb}
        onClosePrivate={activeChat.type === "private" ? handleClosePrivate : undefined}
      />
      <PrivateChatModal
        open={showPrivateModal}
        onClose={() => setShowPrivateModal(false)}
        onStartChat={handleStartPrivateChatById}
      />
    </div>
  );
};

export default ChatApp;
