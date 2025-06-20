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
    <div className="w-full max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setSelectedPerson(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-orange-200 p-8 max-w-lg w-full relative text-gray-900 animate-fadeIn"
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
              className="absolute top-3 right-3 text-orange-400 hover:text-orange-600 text-2xl font-bold bg-orange-50 rounded-full w-9 h-9 flex items-center justify-center shadow border border-orange-100 transition"
              onClick={() => setSelectedPerson(null)}
              aria-label="Close"
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