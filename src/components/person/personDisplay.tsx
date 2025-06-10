import { useState } from "react";
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
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

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
            <div
              className="w-full"
              onClick={() => setSelectedPerson(person)}
              style={{ cursor: "pointer" }}
            >
              <PersonCard person={person} onPersonDeleted={onPersonDeleted} />
            </div>
          </div>
        ))
      )}

      {/* Modal for selected person */}
      {selectedPerson && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={() => setSelectedPerson(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full relative text-gray-900"
            onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the card
          >
            <PersonCard person={selectedPerson} onPersonDeleted={() => {
              setSelectedPerson(null);
              onPersonDeleted();
            }} />
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setSelectedPerson(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayPeople;