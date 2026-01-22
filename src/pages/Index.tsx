import { useAuth } from "@/hooks/useAuth";
import AuthScreen from "@/components/AuthScreen";
import ChatAppRealtime from "@/components/ChatAppRealtime";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();

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

  if (!user) {
    return <AuthScreen />;
  }

  return <ChatAppRealtime />;
};

export default Index;
