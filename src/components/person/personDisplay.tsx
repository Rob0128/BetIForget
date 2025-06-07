import { Person } from '../../firebase/models/person';
import PersonCard from "./personCard";

const DisplayPeople = ({
  people,
  loadingPeople,
  onPersonDeleted
}: {
  people: Person[];
  loadingPeople: boolean;
  onPersonDeleted: () => void;
}) => {
  return (
    <div className="w-full flex flex-wrap justify-center gap-6 px-4">
      {loadingPeople ? (
        <div>Loading people...</div>
      ) : (
        people.map((person, idx) => (
          <div
            key={person.userId + person.name + idx}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex justify-center"
          >
            <PersonCard person={person} onPersonDeleted={onPersonDeleted}/>
          </div>
        ))
      )}
    </div>
  );
};

export default DisplayPeople;