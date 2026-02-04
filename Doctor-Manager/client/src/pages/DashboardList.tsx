import { Layout } from "@/components/Layout";
import { CreateDashboardDialog } from "@/components/CreateDashboardDialog";
import { useDashboards, useDeleteDashboard } from "@/hooks/use-dashboards";
import { useAuth } from "@/hooks/use-auth";
import { usePreferences } from "@/contexts/PreferencesContext";
import { Link } from "wouter";
import { Trash2, Users, Layout as LayoutIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export default function DashboardList() {
  const { data: dashboards, isLoading } = useDashboards();
  const { isEditor } = useAuth();
  const { language, t } = usePreferences();
  const { mutate: deleteDashboard } = useDeleteDashboard();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary/30" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-foreground">{t("لوحات المعلومات", "Dashboards")}</h2>
          <p className="text-slate-500 dark:text-muted-foreground mt-2">{t("اختر لوحة للمتابعة أو قم بإنشاء واحدة جديدة", "Select a dashboard to continue or create a new one")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Dashboards List */}
          {dashboards?.map((dashboard) => (
            <div 
              key={dashboard.id} 
              className="relative group h-full min-h-[160px] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-border bg-white dark:bg-card hover:-translate-y-1"
            >
              {/* Card Header Color */}
              <div className={cn("h-3 w-full", dashboard.color)}></div>
              
              <Link href={`/dashboard/${dashboard.id}`} className="block h-full p-6">
                <div className="flex flex-col h-full justify-between">
                  <div className="space-y-3">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white", dashboard.color)}>
                      <LayoutIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-foreground group-hover:text-primary transition-colors">
                      {dashboard.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 dark:text-muted-foreground font-medium">
                    {dashboard.shareData ? (
                      <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                        <Users className="w-3 h-3" />
                        {t("مشاركة البيانات", "Data Sharing")}
                      </span>
                    ) : (
                      <span className="bg-slate-50 dark:bg-muted px-2 py-1 rounded-full">{t("محلي فقط", "Local Only")}</span>
                    )}
                  </div>
                </div>
              </Link>

              {/* Delete Button (Editors Only) */}
              {isEditor && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-4 left-4 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent dir={language === "ar" ? "rtl" : "ltr"}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("هل أنت متأكد؟", "Are you sure?")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t(
                          `سيتم حذف لوحة "${dashboard.name}" وجميع البيانات المرتبطة بها. لا يمكن التراجع عن هذا الإجراء.`,
                          `Dashboard "${dashboard.name}" and all associated data will be deleted. This action cannot be undone.`
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                      <AlertDialogCancel>{t("إلغاء", "Cancel")}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteDashboard(dashboard.id)} className="bg-red-600 hover:bg-red-700 text-white">
                        {t("حذف نهائي", "Delete Permanently")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          ))}

          {/* Add New Button */}
          <CreateDashboardDialog />
        </div>
      </div>
    </Layout>
  );
}
