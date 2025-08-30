import { Navigation } from "./NavigationBar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useUser } from "@/contexts/AuthContext";

interface PageLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}

export function PageLayout({
  title,
  subtitle,
  children,
  headerAction,
}: PageLayoutProps) {
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="">
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <div className="flex-1 flex justify-center">
              <Navigation />
            </div>
            <div className="flex items-center space-x-4">
              {headerAction}
              {user && (
                <div className="flex items-center space-x-3">
                  <span className="text-md text-gray-800 font-bold">
                    Welcome, {user.name}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="text-black-600 border-blue-500 hover:bg-blue-600 hover:text-white bg-transparent"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
