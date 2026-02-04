import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeOff, Activity, Loader2, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { useLocation } from "wouter";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const { loginWithoutRedirect, isLoggingIn } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { language, setLanguage, t } = usePreferences();

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithoutRedirect({ email, password }, {
      onSuccess: () => {
        setLoggedInEmail(email);
        setShowWelcome(true);
      },
      onError: (error) => {
        toast({
          title: t("فشل الدخول", "Login Failed"),
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const handleWelcomeComplete = () => {
    setLocation("/dashboards");
  };

  if (showWelcome) {
    return <WelcomeScreen userName={loggedInEmail} onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-tajawal light" dir={language === "ar" ? "rtl" : "ltr"}>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleLanguage}
        className="absolute top-4 right-4 text-black hover:bg-gray-200"
        data-testid="button-language-toggle"
      >
        <Globe className="w-5 h-5" />
      </Button>
      
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-black tracking-tight">MedFlow</h1>
          <p className="text-black">{t("سجل الدخول للمتابعة إلى النظام", "Sign in to continue to the system")}</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center text-black">{t("تسجيل الدخول", "Sign In")}</CardTitle>
            <CardDescription className="text-center text-black">
              {t("أدخل البريد الإلكتروني وكلمة المرور", "Enter your email and password")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black">{t("البريد الإلكتروني", "Email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`bg-gray-100 border-gray-200 text-black placeholder:text-blue-500 ${language === "ar" ? "text-right" : "text-left"}`}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-black">{t("كلمة المرور", "Password")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`bg-gray-100 border-gray-200 text-black placeholder:text-blue-500 ${language === "ar" ? "text-right pl-10" : "text-left pr-10"}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors ${language === "ar" ? "left-3" : "right-3"}`}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-lg font-bold text-white"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? <Loader2 className={`animate-spin ${language === "ar" ? "ml-2" : "mr-2"}`} /> : null}
                {t("دخول", "Login")}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center text-xs text-black">
          MedFlow - v1.0.0
        </div>
      </div>
    </div>
  );
}
