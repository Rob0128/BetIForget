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