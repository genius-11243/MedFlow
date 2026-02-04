import { ReactNode, useState } from "react";
import { LogOut, LayoutDashboard, UserCircle2, Settings, ChevronDown, Sun, Moon, Languages } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { usePreferences } from "@/contexts/PreferencesContext";
import { AccountSettingsDialog } from "@/components/AccountSettingsDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const { theme, language, setTheme, setLanguage, t } = usePreferences();
  const [showSettings, setShowSettings] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isDashboardRoute = location.includes("/dashboard/");

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-tajawal" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <LayoutDashboard className="text-primary w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-foreground">
              {isDashboardRoute ? t("لوحة التحكم", "Dashboard") : "MedFlow"}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              title={t("تبديل المظهر", "Toggle theme")}
              data-testid="button-toggle-theme"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
              title={t("تغيير اللغة", "Change language")}
              data-testid="button-toggle-language"
            >
              <Languages className="w-5 h-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2" data-testid="button-account-menu">
                  <UserCircle2 className="w-5 h-5 text-primary" />
                  <span className="hidden sm:inline font-medium max-w-32 truncate">{user?.name || user?.email}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 font-tajawal">
                <DropdownMenuLabel className="flex flex-col">
                  <span className="font-bold">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                  <span className="text-xs text-primary mt-1">
                    {user?.role === 'editor' ? t("محرر", "Editor") : t("مشاهد", "Viewer")}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowSettings(true)} data-testid="menu-item-settings">
                  <Settings className="w-4 h-4 ml-2" />
                  {t("إعدادات الحساب", "Account Settings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="text-destructive focus:text-destructive"
                  data-testid="menu-item-logout"
                >
                  <LogOut className="w-4 h-4 ml-2" />
                  {t("تسجيل الخروج", "Logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Mobile Footer User Info */}
      <div className="sm:hidden bg-card border-t p-3 text-center text-xs text-muted-foreground">
        {t("تم تسجيل الدخول كـ", "Logged in as")}: {user?.email} ({user?.role === 'editor' ? t("محرر", "Editor") : t("مشاهد", "Viewer")})
      </div>

      <AccountSettingsDialog open={showSettings} onOpenChange={setShowSettings} />

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className="font-tajawal" dir={language === "ar" ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("تسجيل الخروج", "Logout")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("هل أنت متأكد أنك تريد تسجيل الخروج؟", "Are you sure you want to logout?")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel data-testid="button-cancel-logout">
              {t("إلغاء", "Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmLogout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-logout"
            >
              {t("تسجيل الخروج", "Logout")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
