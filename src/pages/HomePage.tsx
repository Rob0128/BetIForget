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
    <div className="flex flex-col gap-y-6 px-4 py-8">
      <section className="max-w rounded-lg p-6 text-neutral-900 flex flex-col items-center">
        <h1 className="text-5xl font-semibold text-orange-700 mb-2 tracking-tight font-poppins">
          don't forget your people.
        </h1>
        <p className="text-lg text-neutral-500 font-medium mb-2">
          Keep track of everyone you care about and never miss a special date
          again.
        </p>
        <div className="h-1 w-24 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-300 rounded-full mb-2"></div>
      </section>
      {user && (
        <div className="w-full flex flex-wrap justify-center gap-6 px-4">
          <AddPersonCard onPersonAdded={refreshPeople} />
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