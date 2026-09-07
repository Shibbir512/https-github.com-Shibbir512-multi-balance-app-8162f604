import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/integrations/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem("remember_me") === "true";
  });

  useEffect(() => {
    if (localStorage.getItem("remember_me") === "true") {
      const savedEmail = localStorage.getItem("saved_email");
      const savedPassword = localStorage.getItem("saved_password");
      if (savedEmail) setEmail(savedEmail);
      if (savedPassword) setPassword(savedPassword);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        if (rememberMe) {
          localStorage.setItem("saved_email", email);
          localStorage.setItem("saved_password", password);
          localStorage.setItem("remember_me", "true");
        } else {
          localStorage.removeItem("saved_email");
          localStorage.removeItem("saved_password");
          localStorage.removeItem("remember_me");
        }
        toast.success("লগইন সফল!");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("অ্যাকাউন্ট তৈরি হয়েছে!");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "একটি সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("পাসওয়ার্ড রিসেট করতে প্রথমে উপরের বক্সে আপনার ইমেইলটি লিখুন");
      return;
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success("পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে! ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "একটি সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-sm glass rounded-2xl p-6 animate-fade-in shadow-2xl border border-white/20 dark:border-white/10">
        {/* App Logo */}
        <div className="flex flex-col items-center mb-1">
          <div className="relative group">
            <div
              className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-500 opacity-30 group-hover:opacity-50 blur-md transition duration-500"
            />
            <img
              src="/icon.png"
              alt="জমা খরচ লোগো"
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl shadow-xl object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Premium Glass Badge */}
        <div className="flex flex-col items-center mb-0">
          <div className="relative flex flex-col items-center gap-1 w-fit max-w-[220px] py-2 px-6">
            {/* Subtle glow behind text */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(circle at center, rgba(99,102,241,0.12) 0%, transparent 70%)",
                filter: "blur(25px)",
              }}
            />
            <h1
              className="relative text-2xl font-bold text-center"
              style={{
                background: "linear-gradient(135deg, hsl(252,56%,57%), hsl(245,40%,70%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 8px rgba(99,102,241,0.3))",
              }}
            >
              জমা খরচ
            </h1>
            <span className="relative text-xs text-center text-muted-foreground font-medium">
              আয় বুঝে ব্যয়
            </span>
          </div>

          {/* Tagline */}
          <p className="text-xs text-center mt-1" style={{ color: "#9CA3AF" }}>
            {isLogin ? "আপনার অ্যাকাউন্টে লগইন করুন" : "নতুন অ্যাকাউন্ট তৈরি করুন"}
          </p>

          {/* Gradient Divider */}
          <div
            className="w-full my-4"
            style={{
              height: "1px",
              background: "linear-gradient(90deg, transparent, #E5E7EB, transparent)",
            }}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">ইমেইল</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">পাসওয়ার্ড</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="rounded-xl"
            />
            {isLogin && (
              <div className="flex items-center justify-between pt-1.5 text-xs">
                <label
                  htmlFor="remember-me"
                  className="flex items-center gap-2 cursor-pointer select-none text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                  />
                  <span className="font-medium text-xs group-hover:text-primary transition-colors">
                    আমাকে মনে রেখ
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="font-medium text-xs text-primary hover:underline opacity-80 hover:opacity-100 transition-opacity"
                  disabled={loading}
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              </div>
            )}
          </div>
          <Button type="submit" className="w-full h-11 rounded-2xl btn-primary" disabled={loading}>
            {loading ? "অপেক্ষা করুন..." : isLogin ? "লগইন" : "সাইন আপ"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {isLogin ? "অ্যাকাউন্ট নেই? সাইন আপ করুন" : "অ্যাকাউন্ট আছে? লগইন করুন"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
