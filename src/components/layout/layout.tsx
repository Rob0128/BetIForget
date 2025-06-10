import React from "react";
import Footer from "../footer/footer";
import Header from "../header/header";
import bg from "../../assets/backg.png";
import { useUser } from "../../context/AuthContext";
// Example icons from Lucide (install with: npm install lucide-react)
import { Home, Lock, Settings } from "lucide-react";

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
            <aside className="w-64 min-h-screen bg-gradient-to-b from-[#ffb86a] to-[#f19086] text-white p-8 hidden md:flex flex-col shadow-xl">
              <div className="mb-8">
                <span className="text-2xl font-extrabold tracking-tight text-white">Forgettory</span>
                <div className="mt-2 h-1 w-10 bg-cyan-400 rounded"></div>
              </div>
              <nav className="flex-1">
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-lg hover:bg-cyan-700 transition group"
                    >
                      <Home className="w-5 h-5 text-cyan-300 group-hover:text-white" />
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="/protected"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-lg hover:bg-cyan-700 transition group"
                    >
                      <Lock className="w-5 h-5 text-cyan-300 group-hover:text-white" />
                      Protected
                    </a>
                  </li>
                  <li>
                    <a
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-lg hover:bg-cyan-700 transition group"
                    >
                      <Settings className="w-5 h-5 text-cyan-300 group-hover:text-white" />
                      Settings
                    </a>
                  </li>
                </ul>
              </nav>
              <div className="mt-8 border-t border-cyan-900 pt-6 text-xs text-cyan-200 opacity-80">
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