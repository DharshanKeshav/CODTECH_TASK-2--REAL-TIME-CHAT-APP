import { useState } from "react";
import { Cookie, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [username, setUsername] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 2) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
      return;
    }
    onLogin(username.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Crumb Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-biscuit/30 animate-float-crumb"
            style={{
              left: `${15 + i * 15}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
              bottom: "10%",
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md animate-scale-in">
        <div className="bg-card rounded-3xl p-8 shadow-2xl border border-border relative overflow-hidden">
          {/* Lightning Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-lightning/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-biscuit/10 blur-3xl rounded-full" />

          {/* Logo */}
          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <div className="relative">
                <Cookie className="w-12 h-12 text-biscuit animate-lightning-pulse" />
                <Zap className="w-5 h-5 text-lightning absolute -top-1 -right-1" />
              </div>
            </div>
            <h1 className="font-display text-4xl font-bold mb-2">
              <span className="text-gradient-biscuit">Snap</span>
              <span className="text-gradient-lightning">Crumb</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Break bread, share stories ⚡
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">
                Choose your username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username..."
                className={`h-14 bg-input border-border text-lg placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-biscuit/50 focus:border-biscuit transition-all ${
                  isShaking ? "animate-shake border-destructive" : ""
                }`}
                maxLength={20}
              />
              {username && (
                <div className="flex items-center gap-3 mt-4 p-3 bg-secondary/50 rounded-xl animate-fade-in">
                  <img
                    src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${username}`}
                    alt="Your avatar"
                    className="w-12 h-12 rounded-full ring-2 ring-biscuit/50"
                  />
                  <div>
                    <p className="text-sm text-muted-foreground">Your avatar</p>
                    <p className="font-semibold text-foreground">{username}</p>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-14 btn-biscuit text-lg font-bold rounded-xl group"
              disabled={username.trim().length < 2}
            >
              <span className="flex items-center gap-2">
                Start Chatting
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-muted-foreground/60 text-xs mt-6">
            No account needed • Just pick a name and go 🍪
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
