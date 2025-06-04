import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/AuthContext";
import { FirebaseAuth } from "../../firebase";
import { Menu, X } from "lucide-react";

const Header = () => {
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-neutral-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold">
        Forgettory 🔐
      </Link>

      {/* Hamburger Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden"
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Menu Items */}
      <div
        className={`${
          menuOpen ? "flex" : "hidden"
        } absolute top-16 left-0 w-full bg-neutral-900 flex-col items-center gap-4 py-4 md:static md:flex md:flex-row md:gap-4 md:w-auto md:py-0`}
      >
        <Link
          to="/protected"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded text-center"
          onClick={() => setMenuOpen(false)}
        >
          Protected Page
        </Link>
        {user ? (
          <button
            onClick={() => {
              FirebaseAuth.signOut();
              setMenuOpen(false);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign Out
          </button>
        ) : (
          <Link
            to="/auth/sign-in"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded text-center"
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
