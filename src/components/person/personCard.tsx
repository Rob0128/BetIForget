import { useState } from "react";
import presentImg from '../../assets/present.png'; 
import { Person } from '../../firebase/models/person';
import { deletePerson } from '../../firebase/services/personCardService';

const PersonCard = ({
  person,
  onPersonDeleted,
}: {
  person: Person;
  onPersonDeleted?: () => void;
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await deletePerson(person);
      setShowConfirm(false);
      if (onPersonDeleted) onPersonDeleted();
    } catch (err) {
      setError("Failed to delete person.");
      console.error("Delete person failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-sm w-full mx-auto bg-white rounded-2xl shadow-md overflow-hidden flex flex-col items-center p-6 text-gray-900">
      <img
        src={presentImg}
        alt={"present"}
        className="w-24 h-24 rounded-full shadow mb-4"
      />
      <h2 className="text-xl font-semibold">{person.name}</h2>
      <p className="text-sm text-gray-500 mb-2">{person.interests}</p>
      <div className="text-sm">
        <strong>Dates I need a present:</strong>
        {person.datesINeedAPresent && person.datesINeedAPresent.length > 0 ? (
          <ul className="list-disc list-inside">
            {person.datesINeedAPresent.map((x, i) => (
              <li key={i}>{`${x.day}/${x.month + 1}`}</li>
            ))}
          </ul>
        ) : (
          <span> None</span>
        )}
        <p><strong>Previous presents:</strong> {person.previousPresents}</p>
      </div>
      <button
        className="mt-4 bg-orange-700 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
        onClick={() => setShowConfirm(true)}
      >
        Delete
      </button>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-xs relative">
            <p className="mb-4">Are you sure you want to delete <strong>{person.name}</strong>?</p>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-300"
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonCard;