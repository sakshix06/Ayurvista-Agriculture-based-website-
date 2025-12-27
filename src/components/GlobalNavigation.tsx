import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Bookmark, UserCircle } from "lucide-react";
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

  return (
    <nav className="relative shadow-lg border-b" style={{ backgroundColor: '#1A2417' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left Corner */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ABC8A2' }}>
                <span className="font-bold text-sm" style={{ color: '#1A2417' }}>A</span>
              </div>
              <span className="text-xl font-bold" style={{ color: '#ABC8A2' }}>Ayurvista</span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-baseline space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 hover:opacity-80"
                  style={{ color: '#ABC8A2' }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Tablet Navigation - Smaller centered */}
          <div className="hidden md:block lg:hidden absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-baseline space-x-1">
              {navItems.slice(0, 6).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="px-2 py-2 rounded-full text-xs font-medium transition-colors duration-200 hover:opacity-80"
                  style={{ color: '#ABC8A2' }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Language + User Dropdown - Right Side */}
          <div className="hidden md:block">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="px-3 py-1 text-sm rounded-lg border-gray-300"
              >
                {lang === 'en' ? 'हिन्दी' : 'English'}
              </Button>
              
              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 px-3 py-2 rounded-full transition-colors duration-200 hover:opacity-80"
                    style={{ backgroundColor: '#ABC8A2' }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1A2417' }}>
                      <User className="h-4 w-4" style={{ color: '#ABC8A2' }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#1A2417' }}>{userName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center space-x-2">
                      <UserCircle className="h-4 w-4" />
                      <span>{t('user.profile')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/bookmarks" className="flex items-center space-x-2">
                      <Bookmark className="h-4 w-4" />
                      <span>{t('nav.bookmarks')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600"
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
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
              <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg rounded-b-lg" style={{ backgroundColor: '#1A2417' }}>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:opacity-80"
                  style={{ color: '#ABC8A2' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile User Section */}
              <div className="px-3 py-2 border-t mt-2" style={{ borderColor: '#ABC8A2' }}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ABC8A2' }}>
                    <User className="h-4 w-4" style={{ color: '#1A2417' }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#ABC8A2' }}>{userName}</span>
                </div>
                
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:opacity-80"
                    style={{ color: '#ABC8A2' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserCircle className="h-4 w-4" />
                    <span>{t('user.profile')}</span>
                  </Link>
                  <Link
                    to="/bookmarks"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:opacity-80"
                    style={{ color: '#ABC8A2' }}
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
                    className="w-full px-3 py-1 text-sm rounded-lg border-gray-300"
                  >
                    {lang === 'en' ? 'हिन्दी' : 'English'}
                  </Button>
                </div>
                
                {/* Mobile Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-md text-sm font-medium w-full mt-2"
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