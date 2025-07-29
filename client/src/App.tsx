import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/home";
import Lesson from "./pages/lesson";
import Saved from "./pages/saved";
import Account from "./pages/account";
import NotFound from "./pages/not-found";
import { BottomNavigation } from "@/components/bottom-navigation";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/lesson/:memeId" component={Lesson} />
        <Route path="/saved" component={Saved} />
        <Route path="/account" component={Account} />
        <Route component={NotFound} />
      </Switch>
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
