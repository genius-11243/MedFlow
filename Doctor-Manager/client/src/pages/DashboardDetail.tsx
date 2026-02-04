import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { Layout } from "@/components/Layout";
import { useShifts, useUpdateShiftCounts, useDeleteShift } from "@/hooks/use-shifts";
import { useDashboards } from "@/hooks/use-dashboards";
import { useAuth } from "@/hooks/use-auth";
import { usePreferences } from "@/contexts/PreferencesContext";
import { AddShiftDialog } from "@/components/AddShiftDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, Minus, ArrowRight, Clock, User, Trash2, 
  RefreshCcw, Loader2, ChevronDown, ChevronUp 
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Define shift count keys for type safety
type CountKey = 'member1' | 'member2' | 'member3' | 'privateCount';

const COUNT_LABELS_AR: Record<CountKey, string> = {
  member1: "عضو ١",
  member2: "عضو ٢",
  member3: "عضو ٣",
  privateCount: "خاص",
};

const COUNT_LABELS_EN: Record<CountKey, string> = {
  member1: "Member 1",
  member2: "Member 2",
  member3: "Member 3",
  privateCount: "Private",
};

// Component for a single shift row to manage its own state optimistically
function ShiftRow({ shift, dashboardId }: { shift: any, dashboardId: number }) {
  const { isEditor } = useAuth();
  const { language, t } = usePreferences();
  const { mutate: updateCounts } = useUpdateShiftCounts();
  const { mutate: deleteShift } = useDeleteShift();
  const [isExpanded, setIsExpanded] = useState(true);
  const COUNT_LABELS = language === "ar" ? COUNT_LABELS_AR : COUNT_LABELS_EN;

  const handleIncrement = (key: CountKey) => {
    const currentVal = shift.counts?.[key] || 0;
    updateCounts({
      shiftId: shift.id,
      dashboardId,
      counts: { [key]: currentVal + 1 }
    });
  };

  const handleDecrement = (key: CountKey) => {
    const currentVal = shift.counts?.[key] || 0;
    if (currentVal > 0) {
      updateCounts({
        shiftId: shift.id,
        dashboardId,
        counts: { [key]: currentVal - 1 }
      });
    }
  };

  const handleReset = () => {
    updateCounts({
      shiftId: shift.id,
      dashboardId,
      counts: { member1: 0, member2: 0, member3: 0, privateCount: 0 }
    });
  };

  const handleDelete = () => {
    deleteShift({ id: shift.id, dashboardId });
  };

  return (
    <Card className="mb-4 border-slate-200 dark:border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div 
        className="bg-slate-50 dark:bg-muted p-4 flex items-center justify-between cursor-pointer border-b border-slate-100 dark:border-border"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-2.5 rounded-full text-primary">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-foreground">{shift.doctorName}</h3>
            <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-muted-foreground mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{shift.shiftTime}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditor && (
            <div className="flex items-center gap-1 ml-2" onClick={e => e.stopPropagation()}>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReset}
                className="text-slate-400 hover:text-orange-500 hover:bg-orange-50 h-8 w-8 p-0 rounded-full"
                title={t("إعادة ضبط", "Reset")}
              >
                <RefreshCcw className="w-4 h-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                    title={t("حذف", "Delete")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent dir={language === "ar" ? "rtl" : "ltr"}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("حذف المناوبة؟", "Delete Shift?")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t(
                        `هل أنت متأكد من حذف مناوبة د. ${shift.doctorName}؟ سيتم فقدان جميع العدادات.`,
                        `Are you sure you want to delete Dr. ${shift.doctorName}'s shift? All counters will be lost.`
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("إلغاء", "Cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">{t("حذف", "Delete")}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
          {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 dark:text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-slate-400 dark:text-muted-foreground" />}
        </div>
      </div>

      {isExpanded && (
        <CardContent className="p-0">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 border-t border-slate-100 dark:border-border bg-white dark:bg-card">
            {(Object.keys(COUNT_LABELS) as CountKey[]).map((key) => (
              <div key={key} className="p-4 flex flex-col items-center gap-3">
                <span className="text-sm font-medium text-slate-500 dark:text-muted-foreground">{COUNT_LABELS[key]}</span>
                <div className="flex items-center gap-4 w-full justify-between max-w-[140px]">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDecrement(key)}
                    className="h-10 w-10 rounded-xl border-slate-200 dark:border-border text-slate-400 dark:text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5"
                    disabled={!shift.counts?.[key]}
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  
                  <span className="text-2xl font-bold text-slate-800 dark:text-foreground w-8 text-center tabular-nums">
                    {shift.counts?.[key] || 0}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleIncrement(key)}
                    className="h-10 w-10 rounded-xl border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function GrandTotalTable({ shifts }: { shifts: any[] }) {
  const { language, t } = usePreferences();
  const COUNT_LABELS = language === "ar" ? COUNT_LABELS_AR : COUNT_LABELS_EN;
  
  // Calculate totals
  const totals = shifts.reduce((acc, shift) => {
    return {
      member1: acc.member1 + (shift.counts?.member1 || 0),
      member2: acc.member2 + (shift.counts?.member2 || 0),
      member3: acc.member3 + (shift.counts?.member3 || 0),
      privateCount: acc.privateCount + (shift.counts?.privateCount || 0),
    };
  }, { member1: 0, member2: 0, member3: 0, privateCount: 0 });

  return (
    <Card className="mt-8 border-t-4 border-t-primary shadow-lg overflow-hidden bg-white dark:bg-card">
      <div className="bg-slate-50 dark:bg-muted p-4 border-b border-slate-200 dark:border-border">
        <h3 className="font-bold text-lg text-slate-800 dark:text-foreground flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          {t("إجمالي جميع الأطباء", "All Doctors Total")}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-muted/50">
              <TableHead className="text-right font-bold w-[30%]">{t("اسم الطبيب", "Doctor Name")}</TableHead>
              <TableHead className="text-center font-bold text-slate-600 dark:text-muted-foreground">{COUNT_LABELS.member1}</TableHead>
              <TableHead className="text-center font-bold text-slate-600 dark:text-muted-foreground">{COUNT_LABELS.member2}</TableHead>
              <TableHead className="text-center font-bold text-slate-600 dark:text-muted-foreground">{COUNT_LABELS.member3}</TableHead>
              <TableHead className="text-center font-bold text-slate-600 dark:text-muted-foreground">{COUNT_LABELS.privateCount}</TableHead>
              <TableHead className="text-center font-bold bg-slate-100 dark:bg-muted text-primary">{t("المجموع", "Total")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.map((shift) => {
              const rowTotal = (shift.counts?.member1 || 0) + 
                               (shift.counts?.member2 || 0) + 
                               (shift.counts?.member3 || 0) + 
                               (shift.counts?.privateCount || 0);
              return (
                <TableRow key={shift.id} className="hover:bg-slate-50/50 dark:hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium text-slate-800 dark:text-foreground">{shift.doctorName}</TableCell>
                  <TableCell className="text-center text-slate-600 dark:text-muted-foreground font-medium tabular-nums">{shift.counts?.member1 || 0}</TableCell>
                  <TableCell className="text-center text-slate-600 dark:text-muted-foreground font-medium tabular-nums">{shift.counts?.member2 || 0}</TableCell>
                  <TableCell className="text-center text-slate-600 dark:text-muted-foreground font-medium tabular-nums">{shift.counts?.member3 || 0}</TableCell>
                  <TableCell className="text-center text-slate-600 dark:text-muted-foreground font-medium tabular-nums">{shift.counts?.privateCount || 0}</TableCell>
                  <TableCell className="text-center font-bold text-primary bg-primary/5 tabular-nums">{rowTotal}</TableCell>
                </TableRow>
              );
            })}
            
            {/* Grand Total Row */}
            <TableRow className="bg-slate-800 hover:bg-slate-800 border-t-2 border-slate-900">
              <TableCell className="font-bold text-white">{t("الإجمالي الكلي", "Grand Total")}</TableCell>
              <TableCell className="text-center font-bold text-white text-lg">{totals.member1}</TableCell>
              <TableCell className="text-center font-bold text-white text-lg">{totals.member2}</TableCell>
              <TableCell className="text-center font-bold text-white text-lg">{totals.member3}</TableCell>
              <TableCell className="text-center font-bold text-white text-lg">{totals.privateCount}</TableCell>
              <TableCell className="text-center font-bold text-yellow-400 text-xl bg-slate-900">
                {totals.member1 + totals.member2 + totals.member3 + totals.privateCount}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export default function DashboardDetail() {
  const [, params] = useRoute("/dashboard/:id");
  const dashboardId = Number(params?.id);
  const { language, t } = usePreferences();
  
  const { data: dashboards } = useDashboards();
  const { data: shifts, isLoading } = useShifts(dashboardId);
  const [showAddShift, setShowAddShift] = useState(false);

  // Find current dashboard name/details
  const dashboard = dashboards?.find(d => d.id === dashboardId);

  // Trigger Add Shift dialog on mount if no shifts exist yet
  useEffect(() => {
    if (shifts && shifts.length === 0 && !isLoading) {
      const timer = setTimeout(() => setShowAddShift(true), 500);
      return () => clearTimeout(timer);
    }
  }, [shifts, isLoading]);

  if (isLoading || !dashboard) {
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
      <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header Breadcrumb area */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboards" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-muted text-slate-400 dark:text-muted-foreground hover:text-slate-600 dark:hover:text-foreground transition-colors">
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-foreground">{dashboard.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className={cn("w-2 h-2 rounded-full", dashboard.color)}></div>
                <span className="text-sm text-slate-500 dark:text-muted-foreground">{t("قائمة المناوبات الحالية", "Current Shifts List")}</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowAddShift(true)}
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <Plus className={cn("w-5 h-5", language === "ar" ? "ml-2" : "mr-2")} />
            <span className="hidden sm:inline">{t("مناوبة جديدة", "New Shift")}</span>
            <span className="sm:hidden">{t("جديد", "New")}</span>
          </Button>
        </div>

        {/* Content Area */}
        {shifts && shifts.length > 0 ? (
          <div className="space-y-8">
            <div className="space-y-4">
              {shifts.map(shift => (
                <ShiftRow key={shift.id} shift={shift} dashboardId={dashboardId} />
              ))}
            </div>
            
            <GrandTotalTable shifts={shifts} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-card rounded-2xl border border-dashed border-slate-300 dark:border-border">
            <div className="w-16 h-16 bg-slate-50 dark:bg-muted rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-slate-300 dark:text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-slate-600 dark:text-foreground">{t("لا توجد مناوبات مسجلة", "No shifts recorded")}</h3>
            <p className="text-slate-400 dark:text-muted-foreground mt-1 max-w-sm mx-auto">
              {t("ابدأ بإضافة طبيب جديد ومناوبة لبدء تسجيل العدادات", "Start by adding a new doctor and shift to begin recording counters")}
            </p>
            <Button 
              onClick={() => setShowAddShift(true)}
              variant="outline"
              className="mt-6 border-primary/20 text-primary hover:bg-primary/5"
            >
              {t("إضافة مناوبة", "Add Shift")}
            </Button>
          </div>
        )}
      </div>

      <AddShiftDialog 
        open={showAddShift} 
        onOpenChange={setShowAddShift} 
        dashboardId={dashboardId} 
      />
    </Layout>
  );
}
