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
    getPeople()
      .then((data) => setPeople(data))
      .finally(() => setLoadingPeople(false));
  };

  useEffect(() => {
    refreshPeople();
  }, [user]);

  return (
    <div className="flex flex-col gap-y-2 px-2 sm:px-4 py-4 w-full overflow-x-hidden bg-white/20 min-h-screen">
      <section className="max-w-4xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between p-4 text-neutral-900 bg-white/20">
        <div className="flex flex-col items-start flex-1 min-w-0 w-full">
          <h1 className="text-4xl sm:text-5xl font-semibold text-orange-700 mb-1 tracking-tight font-poppins whitespace-normal break-words w-full">
            don't forget your people.
          </h1>
          <p className="text-base sm:text-lg text-neutral-500 font-medium mb-1 w-full">
            Keep track of everyone you care about and never miss a special date
            again.
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-300 rounded-full mb-1"></div>
        </div>
        <div className="flex-shrink-0 mt-4 sm:mt-0 ml-0 sm:ml-8 w-full sm:w-auto max-w-xs">
          <div className="flex justify-center w-full sm:w-auto">
            <AddPersonCard onPersonAdded={refreshPeople} />
          </div>
        </div>
      </section>
      {/* Onboarding instruction below header/add button if no people */}
      {user && !loadingPeople && people.length === 0 && (
        <div className="w-full flex flex-col items-center justify-center">
          {/* Mobile: straight up arrow above text, not cut off */}
          <div className="flex flex-col items-center justify-center sm:hidden">
            <svg
              width="44"
              height="87"
              viewBox="0 0 54 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-1"
              style={{ display: 'block', margin: '0 auto' }}
            >
              <path d="M22 58 V10" stroke="#fb923c" strokeWidth="6" fill="none" markerEnd="url(#arrowheadMobile)" />
              <defs>
                <marker id="arrowheadMobile" markerWidth="12" markerHeight="12" refX="6" refY="6" orient="auto" markerUnits="strokeWidth">
                  <path d="M2,2 L10,6 L2,10 L6,6 L2,2" fill="#fb923c" />
                </marker>
              </defs>
            </svg>
            <span className="text-orange-700 font-bold text-lg bg-white/90 px-5 py-2 rounded-2xl shadow border border-orange-200" style={{ maxWidth: '320px' }}>
              start by adding your first person
            </span>
          </div>
          {/* Desktop: text then arrow to the right, no space between */}
          <div className="hidden sm:flex flex-row items-center justify-center gap-0 ml-32">
            <span className="text-orange-700 font-bold text-lg bg-white/90 px-5 py-2 rounded-2xl shadow border border-orange-200" style={{ maxWidth: '320px' }}>
              start by adding your first person
            </span>
            <svg
              width="100"
              height="70"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="-mt-4"
              style={{ transform: 'rotate(180deg)' }}
            >
              <path d="M95 35 Q60 10 10 60" stroke="#fb923c" strokeWidth="7" fill="none" markerEnd="url(#arrowhead)" />
              <defs>
                <marker id="arrowhead" markerWidth="12" markerHeight="12" refX="6" refY="6" orient="auto" markerUnits="strokeWidth">
                  <path d="M2,2 L10,6 L2,10 L6,6 L2,2" fill="#fb923c" />
                </marker>
              </defs>
            </svg>
          </div>
        </div>
      )}
      {user && (
        <div className="w-full overflow-x-hidden">
          <DisplayPeople
            people={people}
            loadingPeople={loadingPeople}
            onPersonDeleted={refreshPeople}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;