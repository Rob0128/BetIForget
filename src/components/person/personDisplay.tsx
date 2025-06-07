import { useEffect, useState } from "react";
import { Person } from '../../firebase/models/person';
import { getPeople } from '../../firebase/services/personCardService';
import { useUser } from "../../context/AuthContext";
import AddPersonCard from "./addPersonCard";
import PersonCard from "./personCard";

const DisplayPeople = () => {
  const { user, isLoading } = useUser();
  const [people, setPeople] = useState<Person[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoadingPeople(true);
    getPeople()
      .then((data) => setPeople(data))
      .finally(() => setLoadingPeople(false));
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  return (
    <div className="w-full flex flex-wrap justify-center gap-6 px-4">
      <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex justify-center">
        {/* <AddPersonCard /> */}
      </div>
      {loadingPeople ? (
        <div>Loading people...</div>
      ) : (
        people.map((person, idx) => (
          <div
            key={person.userId + person.name + idx} 
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex justify-center"
          >
            <PersonCard person={person} />
          </div>
        ))
      )}
    </div>
  );
};

export default DisplayPeople;