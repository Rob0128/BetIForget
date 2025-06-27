import { useState } from "react";
import { Person } from '../../firebase/models/person';
import PersonCard from "./personCard";
import EditPersonForm from "./editPersonForm";

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
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {loadingPeople ? (
        <div className="col-span-full flex justify-center items-center min-h-[200px] text-lg font-semibold text-gray-500">Loading people...</div>
      ) : (
        people.map((person, idx) => (
          <div
            key={person.userId + person.name + idx}
            className="flex justify-center items-center"
          >
            <div className="w-full max-w-sm flex flex-col items-center justify-center" onClick={() => setSelectedPerson(person)} style={{ cursor: "pointer" }}>
              <PersonCard person={person} onPersonDeleted={onPersonDeleted} />
            </div>
          </div>
        ))
      )}

      {/* Modal for selected person */}
      {selectedPerson && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => { setSelectedPerson(null); setEditMode(false); }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-orange-200 p-8 max-w-lg w-full relative text-gray-900 animate-fadeIn flex flex-col items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            {editMode ? (
              <EditPersonForm
                person={selectedPerson}
                onSave={() => { setEditMode(false); setSelectedPerson(null); onPersonDeleted(); }}
                onCancel={() => setEditMode(false)}
              />
            ) : (
              <>
                <div className="w-full flex flex-col items-center justify-center">
                  <PersonCard
                    person={selectedPerson}
                    onPersonDeleted={() => {
                      setSelectedPerson(null);
                      setShowDeleteConfirm(false);
                      onPersonDeleted();
                    }}
                    isModal={true}
                    showDeleteConfirm={showDeleteConfirm}
                    setShowDeleteConfirm={setShowDeleteConfirm}
                  />
                </div>
                <div className="flex gap-2 mt-4 justify-center w-full">
                  <button
                    className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-2 px-6 rounded-lg shadow transition text-lg"
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-orange-700 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow transition text-lg"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
            <button
              className="absolute top-3 right-3 text-orange-400 hover:text-orange-600 text-2xl font-bold bg-orange-50 rounded-full w-9 h-9 flex items-center justify-center shadow border border-orange-100 transition"
              onClick={() => { setSelectedPerson(null); setEditMode(false); }}
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