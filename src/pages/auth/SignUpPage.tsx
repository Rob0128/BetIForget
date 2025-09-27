import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FirebaseAuth } from "../../firebase";
import { FirebaseError } from "firebase/app";
import { useUser } from "../../context/AuthContext";
//import { getFunctions, httpsCallable } from "firebase/functions";


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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setStatus("Creating account...");
    try {
      await createUserWithEmailAndPassword(
        FirebaseAuth,
        formValues.email,
        formValues.password
      );
      console.log("[SignUp] Firebase user created, calling sendwelcomemail1 via httpsCallable...");
      try {
        console.log("email is:", formValues.email);
        const response = await fetch("https://us-central1-the-forgettory.cloudfunctions.net/helloWorld", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formValues.email }),
        });
        const data = await response.text();
        alert(`Response from Cloud Function: ${data}`);
        //alert(`Response from Cloud Function: ${data}`);

      } catch (err) {
        console.error("[SignUp] Error calling sendwelcomemail1 via httpsCallable:", err);
      }
    } catch (e) {
      const error = e as FirebaseError;
      setError(error.message.replace("Firebase: ", "").replace(/\([^)]*\)/g, ""));
    } finally {
      setIsLoading(false);
      setStatus("");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-white/20 px-2 pt-10 pb-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center border border-orange-100 mt-8">
        <Link className="self-start text-orange-400 hover:text-orange-600 font-semibold mb-4 transition" to="/">
          ◄ Home
        </Link>
        <h1 className="text-3xl font-extrabold text-orange-500 mb-2 font-poppins">Join the Club</h1>
        <p className="text-gray-600 text-sm mb-6 text-center">Create your account and never miss a special date again</p>
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  name="email"
                  onChange={handleInputChange}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  style={{ color: '#222' }}
                  autoComplete="email"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  name="password"
                  onChange={handleInputChange}
                  type="password"
                  placeholder="Create a strong password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  style={{ color: '#222' }}
                  autoComplete="new-password"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
                <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
              </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 text-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link className="text-orange-500 hover:text-orange-700 font-semibold transition" to="/auth/sign-in">
              Sign In
            </Link>
          </p>
        </div>
        {status && <p className="mt-4 text-sm text-orange-600 text-center">{status}</p>}
      </div>
    </main>
  );
};

export default SignUpPage;
