import React from "react";
import Footer from "../footer/footer";
import Header from "../header/header";
import bg from "../../assets/backg.png";
import { useUser } from "../../context/AuthContext";
// Example icons from Lucide (install with: npm install lucide-react)
import { Settings } from "lucide-react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();

  return (
    <div>
      <Header />
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
              </div>
              <div className="flex-1 flex flex-col items-center justify-start px-6 py-8">
                <div className="w-full flex flex-col items-center gap-6">
                  <div className="bg-white/10 rounded-xl p-4 w-full flex flex-col items-center shadow-sm">
                    <span className="text-lg font-semibold text-white/90 mb-2">Welcome!</span>
                    <span className="text-sm text-white/70 text-center">Manage your people, gifts, and special dates all in one place. Use the settings below to customize your experience.</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 w-full flex flex-col items-center shadow-sm">
                    <span className="text-base font-semibold text-white/90 mb-1">Pro Tip</span>
                    <span className="text-xs text-white/60 text-center">Click on a person to view or edit their details. Add new people with the button on the main page!</span>
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
          <main className="flex-grow flex justify-center items-start">
            <div className="w-full mx-auto px-4 py-12">{children}</div>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;