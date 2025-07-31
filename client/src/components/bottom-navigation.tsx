import { Home, User, BookMarked } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

export function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    {
      icon: Home,
      label: "Home",
      href: "/",
      active: location === "/",
    },
    {
      icon: BookMarked,
      label: "Saved",
      href: "/saved",
      active: location === "/saved",
    },
    {
      icon: User,
      label: "Account",
      href: "/account",
      active: location === "/account",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="flex items-center justify-around h-16 px-4 md:justify-between md:max-w-7xl md:mx-auto">
        {/* Desktop Logo */}
        <div className="hidden md:flex items-center space-x-2">
          <Logo size={32} />
          <span className="text-lg font-semibold text-primary">MemsLearn</span>
        </div>
        
        {/* Navigation Items */}
        <div className="flex items-center justify-around w-full md:w-auto md:space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 flex-1 py-2 px-1 rounded-lg transition-colors md:flex-row md:space-y-0 md:space-x-2 md:flex-none md:px-4",
                  item.active
                    ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium md:text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}