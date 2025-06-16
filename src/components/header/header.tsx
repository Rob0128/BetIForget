import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/AuthContext";
import { FirebaseAuth } from "../../firebase";
import { Menu, X } from "lucide-react";
import clockLogoImg from '../../assets/clocklogo.png'; 

const Header = () => {
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full text-neutral-900 px-8 py-5 flex justify-between items-center shadow-xl border-b border-orange-100/40">
      <Link to="/" className="text-2xl font-extrabold flex items-center gap-4 tracking-tight font-poppins group">
        <span className="transition-colors group-hover:text-orange-500">The Forgettening</span>
        <img
          src={clockLogoImg}
          alt="present"
          className="w-14 h-14 rounded-full align-middle shadow-lg border-2 border-orange-200 group-hover:scale-105 transition-transform"
        />
      </Link>

      {/* Hamburger Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden p-2 rounded-full border border-orange-200 bg-white shadow hover:bg-orange-100 transition z-50"
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Menu Items */}
      <div
        className={`$
          menuOpen ? "flex" : "hidden"
        } absolute top-20 left-0 w-full flex-col items-center gap-6 py-6 bg-white/95 shadow-2xl md:static md:flex md:flex-row md:gap-6 md:w-auto md:py-0 md:bg-transparent md:shadow-none z-40`}
      >
        {user ? (
          <>
            {/* Desktop user info and sign out (inline) */}
            <div className="hidden md:flex items-center gap-4 bg-orange-50 px-4 py-2 rounded-xl shadow border border-orange-100">
              <span className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm text-neutral-700 font-semibold">{user.email}</span>
              </span>
              <button
                onClick={() => {
                  FirebaseAuth.signOut();
                }}
                className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-2 px-5 rounded-lg shadow transition"
              >
                Sign Out
              </button>
            </div>

            {/* Mobile user info and sign out (inside menu) */}
            {menuOpen && (
              <div className="flex flex-col items-center gap-3 md:hidden bg-orange-50 px-4 py-3 rounded-xl shadow border border-orange-100 w-11/12 mx-auto">
                <span className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-sm text-neutral-700 font-semibold">{user.email}</span>
                </span>
                <button
                  onClick={() => {
                    FirebaseAuth.signOut();
                    setMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-2 px-5 rounded-lg shadow transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </>
        ) : (
          <Link
            to="/auth/sign-in"
            className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-2 px-6 rounded-lg shadow transition text-center"
            onClick={() => setMenuOpen(false)}
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
