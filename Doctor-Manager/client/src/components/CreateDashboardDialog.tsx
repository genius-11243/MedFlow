import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Loader2 } from "lucide-react";
import { useCreateDashboard } from "@/hooks/use-dashboards";
import { useToast } from "@/hooks/use-toast";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

const COLORS = [
  { name: "Blue", value: "bg-blue-600" },
  { name: "Emerald", value: "bg-emerald-600" },
  { name: "Violet", value: "bg-violet-600" },
  { name: "Amber", value: "bg-amber-600" },
  { name: "Rose", value: "bg-rose-600" },
  { name: "Slate", value: "bg-slate-600" },
];

export function CreateDashboardDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [shareData, setShareData] = useState(false);
  const { language, t } = usePreferences();
  
  const { mutate, isPending } = useCreateDashboard();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    mutate({
      name,
      color: selectedColor,
      shareData,
    }, {
      onSuccess: () => {
        setOpen(false);
        setName("");
        setShareData(false);
        toast({
          title: t("تم الإنشاء بنجاح", "Created Successfully"),
          description: t(`تم إنشاء لوحة ${name} بنجاح`, `Dashboard ${name} has been created`),
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-full min-h-[160px] flex flex-col items-center justify-center gap-4 bg-white dark:bg-card border-2 border-dashed border-slate-300 dark:border-border rounded-2xl text-slate-500 dark:text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all group shadow-sm hover:shadow-md">
          <div className="p-4 rounded-full bg-slate-100 dark:bg-muted group-hover:bg-primary/10 transition-colors">
            <PlusCircle className="w-8 h-8" />
          </div>
          <span className="text-lg font-bold">{t("لوحة جديدة", "New Dashboard")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md font-tajawal" dir={language === "ar" ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">{t("إضافة لوحة جديدة", "Add New Dashboard")}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">{t("اسم اللوحة", "Dashboard Name")}</Label>
            <Input 
              id="name" 
              placeholder={t("مثال: قسم الطوارئ", "e.g. Emergency Department")} 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="h-12 text-lg"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base">{t("لون التمييز", "Accent Color")}</Label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={cn(
                    "w-10 h-10 rounded-full transition-all border-2",
                    color.value,
                    selectedColor === color.value 
                      ? "border-slate-900 dark:border-white scale-110 shadow-lg ring-2 ring-offset-2 ring-primary/20" 
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                  aria-label={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-muted rounded-xl border dark:border-border">
            <Checkbox 
              id="share" 
              checked={shareData}
              onCheckedChange={(checked) => setShareData(checked as boolean)}
              className="w-6 h-6 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor="share" className="text-base cursor-pointer select-none">
              {t("هل تريد مشاركة هذه البيانات مع الأجهزة الأخرى؟", "Share this data with other devices?")}
            </Label>
          </div>

          <div className="flex justify-end pt-2">
            <Button 
              type="submit" 
              disabled={isPending || !name.trim()}
              className="w-full h-12 text-lg bg-primary hover:bg-primary/90"
            >
              {isPending ? <Loader2 className={`animate-spin w-5 h-5 ${language === "ar" ? "ml-2" : "mr-2"}`} /> : null}
              {t("إنشاء اللوحة", "Create Dashboard")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
