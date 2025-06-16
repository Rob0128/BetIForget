import { useState, Fragment } from "react";
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
    <div className="w-full max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 bg-gradient-to-br from-orange-50 via-white to-amber-50 rounded-3xl shadow-2xl border border-orange-100/30 mt-12">
      {loadingPeople ? (
        <div>Loading people...</div>
      ) : (
        people.map((person, idx) => (
          <div
            key={person.userId + person.name + idx}
            className="flex justify-center"
          >
            <div className="w-full max-w-sm" onClick={() => setSelectedPerson(person)} style={{ cursor: "pointer" }}>
              <PersonCard person={person} onPersonDeleted={onPersonDeleted} />
            </div>
          </div>
        ))
      )}

      {/* Modal for selected person */}
      {selectedPerson && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75"
          onClick={() => setSelectedPerson(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full relative text-gray-900"
            onClick={e => e.stopPropagation()}
          >
            <PersonCard
              person={selectedPerson}
              onPersonDeleted={() => {
                setSelectedPerson(null);
                onPersonDeleted();
              }}
              isModal={true}
            />
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