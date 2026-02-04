import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocation } from "wouter"; // Replit templates usually use wouter

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function MonthDashboard() {
  const [, setLocation] = useLocation();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-primary">MedFlow Archives</h1>
        <p className="text-muted-foreground mt-2">Select a month to view detailed patient data and metrics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {months.map((month, index) => (
          <Card 
            key={month} 
            className="cursor-pointer hover:border-primary transition-all hover:shadow-lg group"
            onClick={() => setLocation(`/dashboard/${index + 1}`)} // Navigates to e.g., /dashboard/1
          >
            <CardHeader>
              <CardTitle className="group-hover:text-primary">{month}</CardTitle>
              <CardDescription>
                View reports for {month} 2024
              </CardDescription>
            </CardHeader>
            <div className="px-6 pb-4 flex justify-between items-center text-xs text-muted-foreground">
              <span>Records: --</span>
              <span className="text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Open →
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}