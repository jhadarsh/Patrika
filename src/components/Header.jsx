import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/agent/sales", label: "Sales Agent" },
    { to: "/agent/technical", label: "Technical Agent" },
    { to: "/agent/pricing", label: "Pricing Agent" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header 
        className={`w-full sticky top-0 z-50 transition-all duration-500 ${
          scrolled 
            ? "bg-white/70 backdrop-blur-xl shadow-lg shadow-black/5" 
            : "bg-white/40 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">

            {/* Logo with Animation */}
            <Link 
              to="/" 
              className="group relative font-satoshi text-2xl sm:text-3xl font-bold text-primary"
            >
              <span className="relative z-10 transition-all duration-300 group-hover:text-accent2">
                Patrika
              </span>
              <span className="absolute -inset-2 bg-gradient-to-r from-accent2/0 via-accent2/10 to-accent2/0 rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-accent2 to-purple-500 group-hover:w-full transition-all duration-500" />
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`group relative px-4 py-2 font-roboto text-sm lg:text-base font-medium rounded-lg transition-all duration-300 ${
                    isActive(link.to)
                      ? "text-accent2"
                      : "text-primary/70 hover:text-primary"
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  
                  {/* Hover Background */}
                  <span className="absolute inset-0 bg-gradient-to-r from-accent2/0 via-accent2/5 to-accent2/0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  
                  {/* Active Indicator */}
                  {isActive(link.to) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-accent2 to-transparent animate-pulse" />
                  )}
                  
                  {/* Hover Glow */}
                  <span className="absolute -inset-1 bg-accent2/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setOpen(true)} 
              className="md:hidden relative p-2 text-primary group"
              aria-label="Open menu"
            >
              <HiMenu className="text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90" />
              <span className="absolute inset-0 bg-accent2/10 rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {open && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
            onClick={() => setOpen(false)}
          />
          
          {/* Sidebar */}
          <div 
            className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-2xl shadow-2xl z-50 animate-slideInRight"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent2/5 via-transparent to-purple-500/5 pointer-events-none" />
            
            <div className="relative h-full flex flex-col p-6">
              {/* Close Button */}
              <button 
                onClick={() => setOpen(false)} 
                className="group self-end p-2 text-primary mb-8 relative"
                aria-label="Close menu"
              >
                <HiX className="text-3xl transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" />
                <span className="absolute inset-0 bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300" />
              </button>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={`group relative px-6 py-4 font-roboto text-lg font-medium rounded-xl transition-all duration-300 animate-slideInRight ${
                      isActive(link.to)
                        ? "text-accent2 bg-accent2/10"
                        : "text-primary/80 hover:text-primary hover:bg-accent1/50"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        isActive(link.to) 
                          ? "bg-accent2 scale-100" 
                          : "bg-primary/30 scale-0 group-hover:scale-100"
                      }`} />
                      {link.label}
                    </span>
                    
                    {/* Hover Effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-accent2/0 via-accent2/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    
                    {/* Active Border */}
                    {isActive(link.to) && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-gradient-to-b from-accent2 to-purple-500 rounded-r-full" />
                    )}
                  </Link>
                ))}
              </nav>

              {/* Decorative Element */}
              <div className="mt-auto pt-8 border-t border-primary/10">
                <p className="text-xs text-primary/40 font-roboto text-center">
                  Autonomous RFP System
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
}