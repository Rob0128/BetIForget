import { useEffect, useState } from "react";
import { useUser } from "../context/AuthContext";
import { getPeople } from "../firebase/services/personCardService";
import { Person } from "../firebase/models/person";
import AddPersonCard from "../components/person/addPersonCard";
import DisplayPeople from "../components/person/personDisplay";

const HomePage = () => {
  const { user } = useUser();
  const [people, setPeople] = useState<Person[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(true);

  // Fetch people from Firestore
  const refreshPeople = () => {
    if (!user) return;
    setLoadingPeople(true);
    getPeople(user.uid)
      .then((data) => setPeople(data))
      .catch((error) => {
        console.error("Error fetching people:", error);
        setPeople([]);
      })
      .finally(() => setLoadingPeople(false));
  };

  useEffect(() => {
    refreshPeople();
  }, [user]);

  return (
    <div className="flex flex-col gap-y-2 px-2 sm:px-4 py-4 w-full overflow-x-hidden bg-white/20 min-h-screen">
      {/* Show Sign In button if logged out */}
      {!user && (
        <>
          <section className="flex flex-col items-center justify-center mt-16 mb-10">
            <div className="bg-white/90 border border-orange-100 rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center gap-6 max-w-md w-full">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-500 font-poppins mb-2 text-center">
                Welcome to the never late club
              </h1>
              <p className="text-gray-600 text-lg text-center mb-2">
                Sign in or create an account to manage your people, gifts, and
                special dates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <a
                  href="/auth/sign-in"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3 px-7 rounded-xl shadow-lg text-lg transition w-full sm:w-auto"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                    />
                    <circle cx="8.5" cy="7" r="4" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 8v6M23 11h-6"
                    />
                  </svg>
                  Sign In
                </a>
                <a
                  href="/auth/sign-up"
                  className="flex items-center justify-center gap-2 bg-white border border-orange-300 text-orange-500 font-bold py-3 px-7 rounded-xl shadow-lg text-lg transition hover:bg-orange-50 w-full sm:w-auto"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Sign Up
                </a>
              </div>
            </div>
          </section>
          {/* Fun/Creative Infographics Section */}
          <div className="w-full flex flex-col items-center relative">
            {/* Wavy divider */}
            <svg
              viewBox="0 0 1440 120"
              className="w-full h-16 -mb-2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#fbbf24"
                fillOpacity=".25"
                d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,80C960,96,1056,128,1152,128C1248,128,1344,96,1392,80L1440,64V120H0Z"
              />
            </svg>
            <section className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-2 sm:px-0 mt-0">
              <div className="flex flex-col items-center text-center bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-50 rounded-2xl shadow-lg p-7 border border-orange-50 relative overflow-hidden">
                <span className="text-5xl mb-2">🎁</span>
                <h3 className="text-xl font-extrabold text-orange-500 mb-2 font-poppins">
                  Never Miss a Gift
                </h3>
                <p className="text-gray-700 text-base font-medium">
                  Track birthdays, anniversaries, and special occasions for
                  everyone you care about. Get reminders so you never forget a
                  gift again!
                </p>
                <span className="absolute right-2 bottom-2 text-3xl opacity-20 select-none">
                  🎉
                </span>
              </div>
              <div className="flex flex-col items-center text-center bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-50 rounded-2xl shadow-lg p-7 border border-orange-50 relative overflow-hidden">
                <span className="text-5xl mb-2">⏰</span>
                <h3 className="text-xl font-extrabold text-orange-500 mb-2 font-poppins">
                  Smart Reminders
                </h3>
                <p className="text-gray-700 text-base font-medium">
                  Receive timely, intelligent reminders for upcoming events.
                  NeverLateClub helps you plan ahead and avoid last-minute stress.
                </p>
                <span className="absolute left-2 top-2 text-3xl opacity-20 select-none">
                  💡
                </span>
              </div>
              <div className="flex flex-col items-center text-center bg-gradient-to-br from-yellow-50 via-orange-100 to-amber-100 rounded-2xl shadow-lg p-7 border border-orange-50 relative overflow-hidden">
                <span className="text-5xl mb-2">💡</span>
                <h3 className="text-xl font-extrabold text-orange-500 mb-2 font-poppins">
                  Personalized Gift Ideas
                </h3>
                <p className="text-gray-700 text-base font-medium">
                  Save and organize gift ideas for each person. Get inspiration
                  and keep track of what you’ve given in the past.
                </p>
                <span className="absolute left-2 bottom-2 text-3xl opacity-20 select-none">
                  📝
                </span>
              </div>
            </section>
            {/* Tagline */}
            <div className="max-w-2xl mx-auto mt-10 text-center text-orange-500 text-2xl font-extrabold font-poppins flex flex-col items-center gap-2">
              <span className="inline-block bg-orange-100 rounded-full px-6 py-2 shadow">
                Make every occasion unforgettable 🎈
              </span>
              <span className="text-base text-gray-600 font-normal mt-2">
                Join NeverLateClub today and become the friend who always remembers!
              </span>
            </div>
            {/* Fun animations */}
            <style>{`
              @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              .animate-spin-slow { animation: spin-slow 4s linear infinite; }
              @keyframes wiggle { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
              .animate-wiggle { animation: wiggle 1.2s ease-in-out infinite; }
            `}</style>
          </div>
        </>
      )}
      {user && (
        <>
          <section className="max-w-5xl w-full mx-auto bg-white/40 rounded-2xl shadow-lg border border-orange-100 p-6 sm:p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex-1 space-y-3">
                <h1 className="text-4xl sm:text-5xl font-bold text-orange-700 tracking-tight font-poppins leading-tight">
                  Never Forget the People You Love
                </h1>
                <p className="text-lg text-gray-700 font-medium leading-relaxed">
                  Keep track of everyone you care about and never miss a special date again. 
                  {people.length === 0 ? "Get started by adding your first person below." : `You're tracking ${people.length} ${people.length === 1 ? 'person' : 'people'}.`}
                </p>
                <div className="h-1 w-32 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-300 rounded-full"></div>
              </div>
              <div className="flex-shrink-0 w-full sm:w-auto">
                <AddPersonCard onPersonAdded={refreshPeople} />
              </div>
            </div>
          </section>
          {/* Onboarding section for new users */}
          {user && !loadingPeople && people.length === 0 && (
            <div className="max-w-4xl w-full mx-auto">
              <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl border-2 border-dashed border-orange-200 p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-orange-700 font-poppins">
                    Let's Get Started!
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    Add your first person to start tracking important dates like birthdays, anniversaries, and special occasions. We'll send you timely reminders so you never miss a moment that matters.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-100 px-4 py-2 rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Click the "Add person" button above to begin</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="w-full overflow-x-hidden">
            {loadingPeople ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
                <p className="text-gray-600 font-medium">Loading your people...</p>
              </div>
            ) : (
              <DisplayPeople
                people={people}
                loadingPeople={loadingPeople}
                onPersonDeleted={refreshPeople}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;