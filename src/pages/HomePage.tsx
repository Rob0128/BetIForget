import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    <div className="flex flex-col w-full overflow-x-hidden bg-white min-h-screen">
      {/* Landing page for non-authenticated users */}
      {!user && (
        <div className="w-full">
          {/* Hero Section */}
          <section className="max-w-6xl mx-auto px-4 pt-12 pb-20">
            <div className="text-center mb-16">
              {/* Social proof badge */}
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-green-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                <span>Join 10,000+ people who never miss important dates</span>
              </div>
              
              {/* Main headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Never Forget
                <span className="block bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  The People You Love
                </span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Track birthdays, anniversaries, and special occasions. Get intelligent reminders and personalized gift ideas for everyone you care about.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link
                  to="/auth/sign-up"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 min-w-[200px]"
                >
                  Sign Up
                </Link>
                <Link
                  to="/auth/sign-in"
                  className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold py-4 px-8 rounded-full text-lg transition-all duration-200 min-w-[200px]"
                >
                  Sign In
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
                  </svg>
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" />
                  </svg>
                  <span>Works Everywhere</span>
                </div>
              </div>
            </div>
          </section>
          
          {/* Features Section */}
          <section className="bg-gradient-to-b from-orange-50 to-amber-50 py-20">
            <div className="max-w-5xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Everything You Need to Stay Connected
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Our simple yet powerful tools help you remember what matters most
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center bg-white rounded-2xl shadow-lg p-8 border border-orange-100 relative overflow-hidden">
                  <span className="text-5xl mb-4">🎁</span>
                  <h3 className="text-xl font-bold text-orange-600 mb-3">
                    Never Miss a Gift
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Track birthdays, anniversaries, and special occasions for everyone you care about. Get reminders so you never forget a gift again!
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center bg-white rounded-2xl shadow-lg p-8 border border-orange-100 relative overflow-hidden">
                  <span className="text-5xl mb-4">⏰</span>
                  <h3 className="text-xl font-bold text-orange-600 mb-3">
                    Smart Reminders
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Receive timely, intelligent reminders for upcoming events. Plan ahead and avoid last-minute stress.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center bg-white rounded-2xl shadow-lg p-8 border border-orange-100 relative overflow-hidden">
                  <span className="text-5xl mb-4">💡</span>
                  <h3 className="text-xl font-bold text-orange-600 mb-3">
                    Gift Ideas & History
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Save and organize gift ideas for each person. Get inspiration and keep track of what you've given in the past.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Social Proof Section */}
          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Trusted by thousands of families
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                See what our users have to say
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">
                    "I used to forget my mom's birthday every year. Since using this app, I've never missed an important date!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 font-bold">
                      S
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Sarah M.</p>
                      <p className="text-gray-500 text-sm">Happy daughter</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">
                    "The gift ideas feature is amazing! I always have thoughtful gifts ready for everyone in my family."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 font-bold">
                      M
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Michael R.</p>
                      <p className="text-gray-500 text-sm">Thoughtful gift-giver</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="bg-gradient-to-r from-orange-500 to-amber-500 py-20">
            <div className="max-w-4xl mx-auto px-4 text-center text-white">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Never Forget Again?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of people who are strengthening their relationships through thoughtful remembrance.
              </p>
              <Link
                to="/auth/sign-up"
                className="inline-block bg-white text-orange-600 font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Get Started - It's Free!
              </Link>
            </div>
          </section>
        </div>
      )}

      {/* Dashboard for authenticated users */}
      {user && (
        <div className="px-2 sm:px-4 py-4">
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

          <div className="max-w-5xl w-full mx-auto">
            {loadingPeople ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
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
        </div>
      )}
    </div>
  );
};

export default HomePage;