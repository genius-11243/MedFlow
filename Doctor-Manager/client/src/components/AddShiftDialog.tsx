import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCreateShift } from "@/hooks/use-shifts";
import { useToast } from "@/hooks/use-toast";
import { usePreferences } from "@/contexts/PreferencesContext";

interface AddShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dashboardId: number;
}

export function AddShiftDialog({ open, onOpenChange, dashboardId }: AddShiftDialogProps) {
  const [doctorName, setDoctorName] = useState("");
  const [shiftTime, setShiftTime] = useState("");
  const { language, t } = usePreferences();
  
  const { mutate, isPending } = useCreateShift();
  const { toast } = useToast();

  // Reset form when opened
  useEffect(() => {
    if (open) {
      setDoctorName("");
      // Default shift time to current readable time range or blank
      const now = new Date();
      const hours = now.getHours();
      const periodAr = hours >= 12 ? "م" : "ص";
      const periodEn = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      const endHours = (displayHours + 8) % 12 || 12;
      if (language === "ar") {
        setShiftTime(`${displayHours}:00 ${periodAr} - ${endHours}:00 ${periodAr}`);
      } else {
        setShiftTime(`${displayHours}:00 ${periodEn} - ${endHours}:00 ${periodEn}`);
      }
    }
  }, [open, language]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim() || !shiftTime.trim()) return;

    mutate({
      dashboardId,
      doctorName,
      shiftTime,
    }, {
      onSuccess: () => {
        onOpenChange(false);
        toast({
          title: t("تم الإضافة بنجاح", "Added Successfully"),
          description: t(`تم إضافة مناوبة ${doctorName}`, `${doctorName}'s shift has been added`),
        });
      },
      onError: (err) => {
        toast({
          title: t("خطأ", "Error"),
          description: err.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md font-tajawal" dir={language === "ar" ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">{t("تسجيل مناوبة جديدة", "Register New Shift")}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="doctorName" className="text-base">{t("اسم الطبيب", "Doctor Name")}</Label>
            <Input 
              id="doctorName" 
              placeholder={t("د. محمد احمد", "Dr. John Smith")} 
              value={doctorName} 
              onChange={(e) => setDoctorName(e.target.value)}
              className="h-12 text-lg"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shiftTime" className="text-base">{t("وقت المناوبة", "Shift Time")}</Label>
            <Input 
              id="shiftTime" 
              placeholder={t("8:00 ص - 4:00 م", "8:00 AM - 4:00 PM")} 
              value={shiftTime} 
              onChange={(e) => setShiftTime(e.target.value)}
              className="h-12 text-lg"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isPending || !doctorName.trim() || !shiftTime.trim()}
              className="w-full h-12 text-lg bg-primary hover:bg-primary/90"
            >
              {isPending ? <Loader2 className={`animate-spin w-5 h-5 ${language === "ar" ? "ml-2" : "mr-2"}`} /> : null}
              {t("بدء المناوبة", "Start Shift")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
