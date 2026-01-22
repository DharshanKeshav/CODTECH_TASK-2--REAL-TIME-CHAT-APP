import { useState } from "react";
import { Cookie, Users, Sparkles, Copy, Check, Zap, Search, LogOut } from "lucide-react";
import { toast } from "sonner";
import UserListItem from "./UserListItem";
import CrumbCard from "./CrumbCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

interface User {
  id: string;
  username: string;
  avatar: string;
  chatId: string;
  isOnline: boolean;
}

interface Crumb {
  id: string;
  username: string;
  avatar: string;
  status: string;
  time: string;
}

interface ChatSidebarRealtimeProps {
  currentUser: {
    username: string;
    chatId: string;
    avatar: string;
  };
  users: User[];
  crumbs: Crumb[];
  onStartPrivateChat: (userId: string, username: string, chatId: string) => void;
  onSearchUser: (chatId: string) => void;
}

const ChatSidebarRealtime = ({
  currentUser,
  users,
  crumbs,
  onStartPrivateChat,
  onSearchUser,
}: ChatSidebarRealtimeProps) => {
  const { signOut } = useAuth();
  const [copied, setCopied] = useState(false);
  const [searchId, setSearchId] = useState("");

  const copyId = () => {
    navigator.clipboard.writeText(currentUser.chatId);
    setCopied(true);
    toast.success("Chat ID copied!", {
      description: "Share it to receive private messages",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      onSearchUser(searchId.trim());
      setSearchId("");
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
  };

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Cookie className="w-6 h-6 text-biscuit" />
            <h1 className="font-display text-xl font-bold">
              <span className="text-gradient-biscuit">Snap</span>
              <span className="text-gradient-lightning">Crumb</span>
            </h1>
            <Zap className="w-4 h-4 text-lightning" />
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleLogout}
            className="hover:bg-destructive/20 hover:text-destructive"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        {/* Current User */}
        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-12 h-12 rounded-full ring-2 ring-biscuit"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-sidebar" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">
              {currentUser.username}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {currentUser.chatId}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={copyId}
            className="hover:bg-biscuit/20 hover:text-biscuit"
            title="Copy Chat ID"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Search by Chat ID */}
      <div className="p-4 border-b border-sidebar-border">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Chat ID to connect..."
            className="flex-1 h-10 bg-input border-border text-sm"
          />
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 btn-biscuit"
            disabled={!searchId.trim()}
          >
            <Search className="w-4 h-4" />
          </Button>
        </form>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-4 mt-4 bg-secondary/50">
          <TabsTrigger
            value="users"
            className="flex-1 gap-2 data-[state=active]:bg-biscuit data-[state=active]:text-biscuit-dark"
          >
            <Users className="w-4 h-4" />
            Users ({users.length})
          </TabsTrigger>
          <TabsTrigger
            value="crumbs"
            className="flex-1 gap-2 data-[state=active]:bg-biscuit data-[state=active]:text-biscuit-dark"
          >
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
              <p className="text-sm">No other users yet</p>
              <p className="text-xs mt-1">Share your Chat ID to connect!</p>
            </div>
          ) : (
            users.map((user) => (
              <UserListItem
                key={user.id}
                username={user.username}
                avatar={user.avatar}
                chatId={user.chatId}
                isOnline={user.isOnline}
                onStartChat={() => onStartPrivateChat(user.id, user.username, user.chatId)}
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

export default ChatSidebarRealtime;
