import { useState } from "react";
import { Cookie, Zap, ArrowRight, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error("Login failed", { description: error.message });
        } else {
          toast.success("Welcome back! 🍪");
        }
      } else {
        if (username.trim().length < 2) {
          toast.error("Username must be at least 2 characters");
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, username.trim());
        if (error) {
          toast.error("Sign up failed", { description: error.message });
        } else {
          toast.success("Account created! 🍪⚡", {
            description: "Welcome to SnapCrumb!",
          });
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
    }

    setLoading(false);
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

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username..."
                  className="h-12 bg-input border-border"
                  maxLength={20}
                  required={!isLogin}
                />
                {username && (
                  <div className="flex items-center gap-3 mt-2 p-3 bg-secondary/50 rounded-xl">
                    <img
                      src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${username}`}
                      alt="Your avatar"
                      className="w-10 h-10 rounded-full ring-2 ring-biscuit/50"
                    />
                    <div>
                      <p className="text-xs text-muted-foreground">Your avatar</p>
                      <p className="font-semibold text-sm text-foreground">{username}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="h-12 bg-input border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password..."
                className="h-12 bg-input border-border"
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 btn-biscuit text-lg font-bold rounded-xl group"
              disabled={loading}
            >
              <span className="flex items-center gap-2">
                {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </form>

          {/* Toggle */}
          <div className="text-center mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-biscuit transition-colors"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="font-semibold text-biscuit">
                {isLogin ? "Sign Up" : "Sign In"}
              </span>
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-muted-foreground/60 text-xs mt-6">
            Your messages are stored securely 🔒
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
