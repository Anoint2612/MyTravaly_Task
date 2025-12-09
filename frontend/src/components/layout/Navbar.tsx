import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuthStore((state: any) => state);
  const navigate = useNavigate();
  const isLoggedIn = !!user;
  const userRole = user?.role;
  const userName = user?.name;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isHome ? "luxe-glass" : "bg-card border-b border-border"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl luxe-gradient flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-primary-foreground font-bold text-xl">L</span>
            </div>
            <span className="text-2xl font-bold text-foreground">
              Luxe<span className="text-primary">Stay</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Home
            </Link>
            <Link
              to="/hotels"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/hotels" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Hotels
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link to={userRole === "manager" ? "/manager" : "/dashboard"}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-secondary">
                  <div className="w-8 h-8 rounded-full luxe-gradient flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium">{userName}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="luxe">Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/hotels"
                className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hotels
              </Link>
              {isLoggedIn ? (
                <>
                  <Link
                    to={userRole === "manager" ? "/manager" : "/dashboard"}
                    className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    className="px-4 py-2 text-sm font-medium text-destructive hover:bg-secondary rounded-lg transition-colors text-left"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-4">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="luxe" className="w-full">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
