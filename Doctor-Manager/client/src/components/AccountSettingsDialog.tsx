import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Loader2, Sun, Moon, Languages, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AccountSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountSettingsDialog({ open, onOpenChange }: AccountSettingsDialogProps) {
  const { user, updateUserLocally } = useAuth();
  const { theme, language, setTheme, setLanguage, t } = usePreferences();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const updateMutation = useMutation({
    mutationFn: async (data: { name?: string; email?: string; password?: string; theme?: string; language?: string }) => {
      const res = await fetch(api.auth.updateAccount.path, {
        method: api.auth.updateAccount.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, ...data }),
      });
      if (!res.ok) throw new Error(t("حدث خطأ أثناء التحديث", "Error updating account"));
      return res.json();
    },
    onSuccess: (data) => {
      updateUserLocally(data);
      toast({
        title: t("تم التحديث", "Updated"),
        description: t("تم تحديث بياناتك بنجاح", "Your account has been updated successfully"),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("خطأ", "Error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSaveProfile = () => {
    const updates: Record<string, string> = {};
    if (name !== user?.name) updates.name = name;
    if (email !== user?.email) updates.email = email;
    if (Object.keys(updates).length > 0) {
      updateMutation.mutate(updates);
    }
  };

  const handleChangePassword = () => {
    if (!newPassword) return;
    updateMutation.mutate({ password: newPassword });
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
  };

  const handleLanguageChange = (newLanguage: "ar" | "en") => {
    setLanguage(newLanguage);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md font-tajawal" dir={language === "ar" ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {t("إعدادات الحساب", "Account Settings")}
          </DialogTitle>
          <DialogDescription>
            {t("قم بتعديل بياناتك الشخصية والتفضيلات", "Manage your profile and preferences")}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" data-testid="tab-profile">
              {t("الملف الشخصي", "Profile")}
            </TabsTrigger>
            <TabsTrigger value="security" data-testid="tab-security">
              {t("الأمان", "Security")}
            </TabsTrigger>
            <TabsTrigger value="preferences" data-testid="tab-preferences">
              {t("التفضيلات", "Preferences")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {t("الاسم", "Name")}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("أدخل اسمك", "Enter your name")}
                data-testid="input-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {t("البريد الإلكتروني", "Email")}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("أدخل بريدك الإلكتروني", "Enter your email")}
                data-testid="input-email"
              />
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={updateMutation.isPending}
              className="w-full"
              data-testid="button-save-profile"
            >
              {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
              {t("حفظ التغييرات", "Save Changes")}
            </Button>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {t("كلمة المرور الحالية", "Current Password")}
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="********"
                  data-testid="input-current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {t("كلمة المرور الجديدة", "New Password")}
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="********"
                  data-testid="input-new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={updateMutation.isPending || !newPassword}
              className="w-full"
              data-testid="button-change-password"
            >
              {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
              {t("تغيير كلمة المرور", "Change Password")}
            </Button>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6 mt-4">
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                {theme === "light" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {t("المظهر", "Theme")}
              </Label>
              <div className="flex gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => handleThemeChange("light")}
                  className="flex-1"
                  data-testid="button-theme-light"
                >
                  <Sun className="w-4 h-4 ml-2" />
                  {t("فاتح", "Light")}
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => handleThemeChange("dark")}
                  className="flex-1"
                  data-testid="button-theme-dark"
                >
                  <Moon className="w-4 h-4 ml-2" />
                  {t("داكن", "Dark")}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Languages className="w-4 h-4" />
                {t("اللغة", "Language")}
              </Label>
              <div className="flex gap-2">
                <Button
                  variant={language === "ar" ? "default" : "outline"}
                  onClick={() => handleLanguageChange("ar")}
                  className="flex-1"
                  data-testid="button-language-ar"
                >
                  العربية
                </Button>
                <Button
                  variant={language === "en" ? "default" : "outline"}
                  onClick={() => handleLanguageChange("en")}
                  className="flex-1"
                  data-testid="button-language-en"
                >
                  English
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
