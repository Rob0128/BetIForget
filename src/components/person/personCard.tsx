import { useState } from "react";
import presentImg from '../../assets/present.png'; 
import { Person } from '../../firebase/models/person';
import { deletePerson } from '../../firebase/services/personCardService';

const PersonCard = ({
  person,
  onPersonDeleted,
  isModal = false,
}: {
  person: Person;
  onPersonDeleted?: () => void;
  isModal?: boolean;
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

  const content = (
    <>
      <img
        src={presentImg}
        alt={"present"}
        className="w-24 h-24 rounded-full shadow mb-4"
      />
      <h2 className="text-xl font-semibold mb-1">{person.name}</h2>
      <div className="flex flex-wrap gap-1 mb-2">
        {person.interests && person.interests.split(",").filter(t => t.trim()).map((tag, i) => (
          <span key={tag.trim() + i} className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs">{tag.trim()}</span>
        ))}
        {/* Fix: Always check for brands, even if empty string, and filter out empty values */}
        {person.brands && person.brands.split(",").filter(b => b.trim()).length > 0 &&
          person.brands.split(",").filter(b => b.trim()).map((brand, i) => (
            <span key={brand.trim() + i} className="bg-green-200 text-green-800 px-2 py-0.5 rounded-full text-xs">{brand.trim()}</span>
          ))}
      </div>
      <div className="text-sm text-gray-700 w-full">
        <p><strong>Gender:</strong> {person.gender ? (person.gender.charAt(0).toUpperCase() + person.gender.slice(1)) : "Unknown"}</p>
        <p><strong>Age:</strong> {person.age || "-"}</p>
        <p><strong>Budget:</strong> ${person.budgetMin} - ${person.budgetMax}</p>
        <p><strong>Previous presents:</strong> {person.previousPresents || "-"}</p>
        <p><strong>Dates I need a present:</strong> {person.datesINeedAPresent && person.datesINeedAPresent.length > 0 ? (
          person.datesINeedAPresent.map(x => `${x.day}/${x.month + 1}`).join(", ")
        ) : "None"}</p>
      </div>
      <button
        className="mt-4 bg-orange-700 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
        onClick={() => setShowConfirm(true)}
      >
        Delete
      </button>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl border border-orange-200 w-full max-w-xs relative animate-fadeIn">
            <p className="mb-4 text-gray-900 text-base font-semibold">Are you sure you want to delete <strong>{person.name}</strong>?</p>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-bold shadow transition"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return isModal ? (
    <div className="flex flex-col items-center">{content}</div>
  ) : (
    <div className="max-w-sm w-full mx-auto bg-white rounded-2xl shadow-md overflow-hidden flex flex-col items-center p-6 text-gray-900">
      {content}
    </div>
  );
};

export default PersonCard;