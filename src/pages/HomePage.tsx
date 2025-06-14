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
    <div className="flex flex-col items-center gap-y-12 px-4 py-8">
      <section className="max-w rounded-lg p-6 text-neutral-900 mx-auto text-center">
        <h1 className="text-5xl font-semibold text-cyan-800 mb-4 tracking-tight font-poppins">Add Some People You Need To Remember</h1>
        <p className="mb-4 text-neutral-700 font-semibold">Current User: {user?.email || "None"}</p>
      </section>
      {user && (
        <div className="w-full flex flex-wrap justify-center gap-6 px-4">
          <AddPersonCard onPersonAdded={refreshPeople} />
          <DisplayPeople people={people} loadingPeople={loadingPeople} onPersonDeleted={refreshPeople} />
        </div>
      )}
    </div>
  );
};

export default HomePage;