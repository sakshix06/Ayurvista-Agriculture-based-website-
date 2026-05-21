import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Bookmark, UserCircle, ChevronDown } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import Auth from "@/pages/Auth";
import { useI18n } from "@/i18n/I18nProvider";
import { clearStoredToken } from "@/lib/auth";
import { toast } from "sonner";

const GlobalNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { t, toggleLanguage, lang } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get logged-in user name from localStorage
  const userName = localStorage.getItem("herbalgarden_username") || "User";

  const handleLogout = () => {
    clearStoredToken();
    toast.success(t("auth.logoutSuccess"));
    navigate("/login", { replace: true });
  };

  const navItems = [
    { name: t('nav.home'), href: "/" },
    { name: t('nav.search'), href: "/explore" },
    { name: t('nav.about'), href: "/about" },
    { name: t('nav.shop'), href: "/shop" },
    { name: t('nav.consultation'), href: "/consultation" },
    { name: t('nav.blog'), href: "/plant-blog" },
    { name: t('nav.aidetector'), href: "/ai" },
    { name: t('nav.contact'), href: "/contact" }
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 glass-navbar shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left Corner */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#a8e063] shadow-[0_0_12px_rgba(168,224,99,0.4)] transition-all duration-300 group-hover:scale-105">
                <span className="font-extrabold text-sm text-[#1A2417]">A</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white transition-all duration-300 group-hover:text-[#a8e063]">
                Ayur<span className="text-[#a8e063]">vista</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-3.5 py-1.5 text-xs font-bold tracking-widest transition-all duration-300 hover:text-[#a8e063] ${
                    isActive(item.href) ? "text-[#a8e063] text-glow-green" : "text-[#ABC8A2]/80"
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#a8e063] shadow-[0_0_8px_#a8e063] animate-pulse" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Tablet Navigation - Smaller centered */}
          <div className="hidden md:block lg:hidden absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-1">
              {navItems.slice(0, 6).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-2.5 py-1.5 text-[10px] font-bold tracking-wider transition-all duration-300 hover:text-[#a8e063] ${
                    isActive(item.href) ? "text-[#a8e063] text-glow-green" : "text-[#ABC8A2]/80"
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#a8e063] shadow-[0_0_6px_#a8e063]" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Language + User Dropdown - Right Side */}
          <div className="hidden md:block">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="px-4 py-1 h-8 rounded-full text-xs font-semibold border-0 bg-white/10 hover:bg-white/20 text-white transition-all duration-300 shadow-sm"
              >
                {lang === 'en' ? 'हिन्दी' : 'English'}
              </Button>
              
              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 px-3 py-1.5 h-8 rounded-full transition-all duration-300 bg-white/10 hover:bg-white/20 border border-white/5 text-[#ABC8A2]"
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#a8e063] shadow-md">
                      <User className="h-3 w-3 text-[#1A2417]" />
                    </div>
                    <span className="text-xs font-semibold text-white">{userName}</span>
                    <ChevronDown className="h-3 w-3 text-white/60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-zinc-950/95 border-emerald-950/40 text-[#ABC8A2] backdrop-blur-md">
                  <DropdownMenuItem asChild className="hover:bg-emerald-950/30 hover:text-white cursor-pointer">
                    <Link to="/profile" className="flex items-center space-x-2 w-full">
                      <UserCircle className="h-4 w-4" />
                      <span>{t('user.profile')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-emerald-950/30 hover:text-white cursor-pointer">
                    <Link to="/bookmarks" className="flex items-center space-x-2 w-full">
                      <Bookmark className="h-4 w-4" />
                      <span>{t('nav.bookmarks')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-emerald-950/20" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-400 hover:bg-red-950/20 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t('user.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#ABC8A2] hover:bg-white/10 rounded-lg"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-2xl rounded-b-xl bg-[#0a150c]/95 border-t border-white/5 backdrop-blur-xl">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    isActive(item.href) ? "bg-[#a8e063]/10 text-[#a8e063]" : "text-[#ABC8A2] hover:bg-white/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile User Section */}
              <div className="px-3 py-2 border-t mt-2 border-white/5">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#a8e063]">
                    <User className="h-4 w-4" style={{ color: '#1A2417' }} />
                  </div>
                  <span className="text-sm font-semibold text-white">{userName}</span>
                </div>
                
                <div className="space-y-1">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-white/5 text-[#ABC8A2]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserCircle className="h-4 w-4" />
                    <span>{t('user.profile')}</span>
                  </Link>
                  <Link
                    to="/bookmarks"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-white/5 text-[#ABC8A2]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Bookmark className="h-4 w-4" />
                    <span>{t('nav.bookmarks')}</span>
                  </Link>
                </div>
                
                {/* Mobile Language Toggle */}
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleLanguage}
                    className="w-full px-3 py-1 text-sm rounded-lg border-white/10 bg-white/5 hover:bg-white/10 text-white"
                  >
                    {lang === 'en' ? 'हिन्दी' : 'English'}
                  </Button>
                </div>
                
                {/* Mobile Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-400 hover:bg-red-950/20 px-3 py-2 rounded-md text-sm font-medium w-full mt-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('user.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Dialog */}
      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-transparent border-none shadow-none">
          <Auth initialMode="login" />
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default GlobalNavigation;