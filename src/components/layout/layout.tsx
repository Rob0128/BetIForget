import React from "react";
import Footer from "../footer/footer";
import bg from "../../assets/backg.png";
import { useUser } from "../../context/AuthContext";
// Example icons from Lucide (install with: npm install lucide-react)
import { Settings, Home, X } from "lucide-react";
import presentImg from '../../assets/present.png';
import presentImg2 from '../../assets/present2.png';
import clockLogoImg from '../../assets/clocklogo.png';
import backg7Img from '../../assets/backg7.png';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Close menu when clicking outside
  React.useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      const dropdown = document.getElementById('mobile-burger-dropdown');
      if (dropdown && !dropdown.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <div>
      {/* Header removed. Move header content into the main layout */}
      <div
        className="relative flex flex-col min-h-screen text-white bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bg})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white opacity-80 pointer-events-none z-0"></div>
        {/* Sidebar + Main Content */}
        <div className="relative flex flex-row flex-grow z-10">
          {/* Sidebar: Only show when logged in */}
          {user && (
            <aside className="w-64 min-h-screen bg-gradient-to-b from-[#ffb86a] to-[#f19086] text-white p-0 hidden md:flex flex-col shadow-xl">
              <div className="flex flex-col items-center py-8 border-b border-white/20">
                <span className="text-2xl font-extrabold tracking-tight text-white font-poppins">Forgettory</span>
                <div className="mt-2 h-1 w-10 bg-white/60 rounded"></div>
                {/* Submenu buttons */}
                <div className="flex gap-2 mt-6">
                  <a href="/" className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm shadow transition flex items-center"><Home size={16} className="inline-block" /></a>
                  <a href="/settings" className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm shadow transition flex items-center gap-1"><Settings size={16} className="inline-block" /></a>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-start px-6 py-8">
                <div className="w-full flex flex-col items-center gap-6">
                  <div className="bg-white/10 rounded-xl p-4 w-full flex flex-col items-center shadow-sm">
                    <img src={presentImg} alt="Gift" className="w-16 h-16 mb-2 drop-shadow-lg" />
                    <span className="text-lg font-semibold text-white/90 mb-2">Welcome!</span>
                    <span className="text-sm text-white/70 text-center">Manage your people, gifts, and special dates all in one place. Use the settings below to customize your experience.</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 w-full flex flex-col items-center shadow-sm">
                    <img src={clockLogoImg} alt="Birthday Reminder" className="w-14 h-14 mb-2 drop-shadow-md" />
                    <span className="text-base font-semibold text-white/90 mb-1">Pro Tip</span>
                    <span className="text-xs text-white/60 text-center">Click on a person to view or edit their details. Add new people with the button on the main page!</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 w-full flex flex-col items-center shadow-sm">
                    <img src={backg7Img} alt="Friends and Family" className="w-20 h-14 object-cover rounded mb-2" />
                    <span className="text-base font-semibold text-white/90 mb-1">Never Miss a Date</span>
                    <span className="text-xs text-white/60 text-center">Get reminded of birthdays, anniversaries, and special occasions for your friends and loved ones.</span>
                  </div>
                  <nav className="w-full flex flex-col items-center mt-2">
                    <a
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-lg hover:bg-white/10 transition group w-full justify-center"
                    >
                      <Settings className="w-5 h-5 text-white/80 group-hover:text-white" />
                      Settings
                    </a>
                  </nav>
                </div>
              </div>
              <div className="mt-auto px-6 pb-8 pt-6 border-t border-white/20 text-xs text-white/60 opacity-80 text-center">
                &copy; {new Date().getFullYear()} Forgettory, Inc.
              </div>
            </aside>
          )}
          {/* Main Content */}
          <main className="flex-grow flex flex-col items-center justify-start w-full">
            {/* Responsive merged header content */}
            <div className="w-full flex flex-col md:flex-row items-center md:justify-between justify-center px-4 sm:px-6 pt-6 pb-4 gap-4 relative">
              <div className="flex items-center w-full md:w-auto justify-center md:justify-start">
                <a href="/" className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2 tracking-tight font-poppins group text-orange-400 hover:text-orange-600 transition">
                  <img
                    src={presentImg2}
                    alt="present"
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-full align-middle group-hover:scale-105 transition-transform"
                  />
                  <span className="transition-colors whitespace-nowrap text-2xl sm:text-3xl font-extrabold flex items-center gap-2 tracking-tight font-poppins group text-orange-400">The Forgettening</span>
                </a>
                {/* Mobile burger menu: classic hamburger icon, aligned with logo/title */}
                <div className="flex md:hidden items-center ml-auto">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 rounded-full border border-orange-200 bg-white shadow hover:bg-orange-100 transition flex items-center justify-center"
                    aria-label="Toggle menu"
                    style={{ height: '44px', width: '44px', marginLeft: '8px' }}
                  >
                    {/* Hamburger icon (classic three lines) */}
                    {!menuOpen ? (
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect y="6" width="28" height="3" rx="1.5" fill="#fb923c" />
                        <rect y="13" width="28" height="3" rx="1.5" fill="#fb923c" />
                        <rect y="20" width="28" height="3" rx="1.5" fill="#fb923c" />
                      </svg>
                    ) : (
                      <X size={28} color="#fb923c" />
                    )}
                  </button>
                  {/* Mobile dropdown menu */}
                  {menuOpen && (
                    <div id="mobile-burger-dropdown" className="absolute top-16 right-4 bg-white rounded-xl shadow-lg py-4 px-6 flex flex-col gap-4 z-50 min-w-[180px] border border-orange-100">
                      {user ? (
                        <>
                          <span className="flex items-center gap-2 text-neutral-700 font-semibold text-sm">
                            <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            {user.email}
                          </span>
                          <a href="/settings" className="bg-white border border-orange-200 text-orange-500 font-bold py-2 px-6 rounded-lg shadow transition text-center text-xs sm:text-base flex items-center gap-1"><Settings size={16} className="inline-block" /> Settings</a>
                          <button
                            onClick={() => {
                              import('../../firebase').then(({ FirebaseAuth }) => FirebaseAuth.signOut());
                              setMenuOpen(false);
                            }}
                            className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-2 px-5 rounded-lg shadow transition text-xs sm:text-base"
                          >
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <a
                          href="/auth/sign-in"
                          className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-2 px-6 rounded-lg shadow transition text-center text-xs sm:text-base"
                          onClick={() => setMenuOpen(false)}
                        >
                          Sign In
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* User info and sign out button (if logged in) */}
              {user ? (
                <>
                  {/* Desktop: show inline */}
                  <div className="hidden md:flex items-center gap-4 bg-orange-50 px-4 py-2 rounded-xl shadow border border-orange-100 w-full md:w-auto justify-center md:justify-end">
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-xs sm:text-sm text-neutral-700 font-semibold truncate max-w-[120px] sm:max-w-none">{user.email}</span>
                    </span>
                    <button
                      onClick={() => {
                        import('../../firebase').then(({ FirebaseAuth }) => FirebaseAuth.signOut());
                      }}
                      className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-2 px-5 rounded-lg shadow transition text-xs sm:text-base"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center w-full justify-end">
                  <a
                    href="/auth/sign-in"
                    className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-2 px-6 rounded-lg shadow transition text-center text-xs sm:text-base"
                  >
                    Sign In
                  </a>
                </div>
              )}
              {/* Mobile: single burger menu, always rendered on mobile */}
              
            </div>
            {/* Main page content */}
            <div className="w-full mx-auto px-2 sm:px-4 py-8 sm:py-12">{children}</div>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;