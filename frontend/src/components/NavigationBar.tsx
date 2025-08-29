import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, FileText, Users, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex items-center justify-between w-full">
      <nav className="flex items-center space-x-2">
        <Link to="/">
          <Button
            variant={isActive("/") ? "default" : "ghost"}
            size="sm"
            className={
              isActive("/") ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
            }
          >
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </Link>

        <Link to="/issues">
          <Button
            variant={isActive("/issues") ? "default" : "ghost"}
            size="sm"
            className={isActive("/issues") ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
          >
            <FileText className="h-4 w-4 mr-2" />
            Issues
          </Button>
        </Link>

        <Link to="/my-issues">
          <Button
            variant={isActive("/my-issues") ? "default" : "ghost"}
            size="sm"
            className={isActive("/my-issues") ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
          >
            <User className="h-4 w-4 mr-2" />
            My Issues
          </Button>
        </Link>

        <Link to="/users">
          <Button
            variant={isActive("/users") ? "default" : "ghost"}
            size="sm"
            className={isActive("/users") ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
          >
            <Users className="h-4 w-4 mr-2" />
            Users
          </Button>
        </Link>
      </nav>

      {user ? (
        <div className="flex items-center space-x-3">
          <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout()}
            className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      ) : null}
    </div>
  );
}
