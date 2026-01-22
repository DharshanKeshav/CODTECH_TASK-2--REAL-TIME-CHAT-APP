import { MessageCircle } from "lucide-react";

interface UserListItemProps {
  username: string;
  avatar: string;
  chatId: string;
  isOnline: boolean;
  onStartChat: () => void;
}

const UserListItem = ({
  username,
  avatar,
  chatId,
  isOnline,
  onStartChat,
}: UserListItemProps) => {
  return (
    <div 
      onClick={onStartChat}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-all duration-200 group cursor-pointer"
    >
      <div className="relative">
        <img
          src={avatar}
          alt={username}
          className="w-11 h-11 rounded-full ring-2 ring-biscuit/30 group-hover:ring-biscuit/60 transition-all"
        />
        {isOnline ? (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-background" />
        ) : (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-muted-foreground/50 rounded-full ring-2 ring-background" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm truncate">
          {username}
        </p>
        <p className="text-muted-foreground/60 text-xs truncate">
          {chatId}
        </p>
      </div>
      <button
        className="p-2 rounded-full bg-lightning/20 text-lightning hover:bg-lightning/30 transition-all opacity-0 group-hover:opacity-100"
        title="Start private chat"
      >
        <MessageCircle className="w-4 h-4" />
      </button>
    </div>
  );
};

export default UserListItem;
