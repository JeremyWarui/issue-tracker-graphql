import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, FileText, Users } from "lucide-react";

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    return path !== "/" && location.pathname.startsWith(path);

  };

  return (
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
          className={
            isActive("/issues")
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : ""
          }
        >
          <FileText className="h-4 w-4 mr-2" />
          Issues
        </Button>
      </Link>
      <Link to="/users">
        <Button
          variant={isActive("/users") ? "default" : "ghost"}
          size="sm"
          className={
            isActive("/users") ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
          }
        >
          <Users className="h-4 w-4 mr-2" />
          Users
        </Button>
      </Link>
    </nav>
  );
}
