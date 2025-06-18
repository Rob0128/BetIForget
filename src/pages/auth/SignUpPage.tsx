import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FirebaseAuth } from "../../firebase";
import { FirebaseError } from "firebase/app";
import { useUser } from "../../context/AuthContext";

const SignUpPage = () => {
  // ==============================
  // If user is already logged in, redirect to home
  // This logic is being repeated in SignIn and SignUp..
  const { user } = useUser();
  if (user) return <Navigate to="/" />;
  // maybe we can create a wrapper component for these pages
  // just like the ./router/AuthProtectedRoute.tsx? up to you.
  // ==============================
  const [status, setStatus] = useState("");
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("");
    setStatus("Creating account...");
    try {
      await createUserWithEmailAndPassword(
        FirebaseAuth,
        formValues.email,
        formValues.password
      );
    } catch (e) {
      const error = e as FirebaseError;
      alert(error.message);
    }
    setStatus("");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-white/20 px-2 pt-10 pb-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center border border-orange-100 mt-8">
        <Link className="self-start text-orange-400 hover:text-orange-600 font-semibold mb-4 transition" to="/">
          ◄ Home
        </Link>
        <h1 className="text-3xl font-extrabold text-orange-500 mb-2 font-poppins">Sign Up</h1>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            name="email"
            onChange={handleInputChange}
            type="email"
            placeholder="Email"
            className="border border-orange-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 text-base bg-orange-50 placeholder:text-orange-300"
            autoComplete="email"
            required
          />
          <input
            name="password"
            onChange={handleInputChange}
            type="password"
            placeholder="Password"
            className="border border-orange-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 text-base bg-orange-50 placeholder:text-orange-300"
            autoComplete="new-password"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-2 px-6 rounded-lg shadow transition text-lg mt-2"
          >
            Create Account
          </button>
        </form>
        <Link className="mt-4 text-orange-500 hover:text-orange-700 font-semibold transition" to="/auth/sign-in">
          Already have an account? Sign In
        </Link>
        {status && <p className="mt-4 text-sm text-orange-600">{status}</p>}
      </div>
    </main>
  );
};

export default SignUpPage;
