import { Clock } from "lucide-react";

interface CrumbCardProps {
  username: string;
  avatar: string;
  status: string;
  time: string;
}

const CrumbCard = ({ username, avatar, status, time }: CrumbCardProps) => {
  return (
    <div className="crumb-card animate-crumb-appear">
      <div className="flex items-start gap-3">
        <img
          src={avatar}
          alt={username}
          className="w-10 h-10 rounded-full ring-2 ring-biscuit/40"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">
            {username}
          </p>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {status}
          </p>
          <div className="flex items-center gap-1 mt-2 text-muted-foreground/60">
            <Clock className="w-3 h-3" />
            <span className="text-[10px]">{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrumbCard;
