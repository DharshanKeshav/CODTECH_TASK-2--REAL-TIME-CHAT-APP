import { useState } from "react";
import { Cookie, Users, Sparkles, Copy, Check, Zap } from "lucide-react";
import { toast } from "sonner";
import UserListItem from "./UserListItem";
import CrumbCard from "./CrumbCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
}

interface Crumb {
  id: string;
  username: string;
  avatar: string;
  status: string;
  time: string;
}

interface ChatSidebarProps {
  currentUser: {
    username: string;
    chatId: string;
    avatar: string;
  };
  users: User[];
  crumbs: Crumb[];
  onStartPrivateChat: (chatId: string, username: string) => void;
}

const ChatSidebar = ({
  currentUser,
  users,
  crumbs,
  onStartPrivateChat,
}: ChatSidebarProps) => {
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(currentUser.chatId);
    setCopied(true);
    toast.success("Chat ID copied!", {
      description: "Share it to receive private messages",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-4">
          <Cookie className="w-6 h-6 text-biscuit" />
          <h1 className="font-display text-xl font-bold">
            <span className="text-gradient-biscuit">Snap</span>
            <span className="text-gradient-lightning">Crumb</span>
          </h1>
          <Zap className="w-4 h-4 text-lightning" />
        </div>

        {/* Current User */}
        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
          <img
            src={currentUser.avatar}
            alt={currentUser.username}
            className="w-12 h-12 rounded-full ring-2 ring-biscuit"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">
              {currentUser.username}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {currentUser.chatId.slice(0, 12)}...
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={copyId}
            className="hover:bg-biscuit/20 hover:text-biscuit"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 bg-secondary/50">
          <TabsTrigger value="users" className="flex-1 gap-2 data-[state=active]:bg-biscuit data-[state=active]:text-biscuit-dark">
            <Users className="w-4 h-4" />
            Online
          </TabsTrigger>
          <TabsTrigger value="crumbs" className="flex-1 gap-2 data-[state=active]:bg-biscuit data-[state=active]:text-biscuit-dark">
            <Sparkles className="w-4 h-4" />
            Crumbs
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="users"
          className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2 m-0"
        >
          {users.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No other users online</p>
            </div>
          ) : (
            users.map((user) => (
              <UserListItem
                key={user.id}
                username={user.username}
                avatar={user.avatar}
                chatId={user.id}
                isOnline={user.isOnline}
                onStartChat={() => onStartPrivateChat(user.id, user.username)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent
          value="crumbs"
          className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 m-0"
        >
          {crumbs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No crumbs yet</p>
              <p className="text-xs mt-1">Share your status!</p>
            </div>
          ) : (
            crumbs.map((crumb) => (
              <CrumbCard
                key={crumb.id}
                username={crumb.username}
                avatar={crumb.avatar}
                status={crumb.status}
                time={crumb.time}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatSidebar;
