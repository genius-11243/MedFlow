import { useState } from "react";
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Splash } from "@/components/Splash";
import { useAuth } from "@/hooks/use-auth";
import { PreferencesProvider } from "@/contexts/PreferencesContext";
import Login from "@/pages/Login";
import DashboardList from "@/pages/DashboardList";
import DashboardDetail from "@/pages/DashboardDetail";
import NotFound from "@/pages/not-found";

// Protected Route Wrapper
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null; // Or a loading spinner

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/dashboards">
        <ProtectedRoute component={DashboardList} />
      </Route>
      <Route path="/dashboard/:id">
        <ProtectedRoute component={DashboardDetail} />
      </Route>
      <Route path="/">
        <Redirect to="/dashboards" />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider>
        <TooltipProvider>
          <Toaster />
          {showSplash ? (
            <Splash onComplete={() => setShowSplash(false)} />
          ) : (
            <Router />
          )}
        </TooltipProvider>
      </PreferencesProvider>
    </QueryClientProvider>
  );
}

export default App;
