import { useState } from "react";
import presentImg from '../../assets/present.png'; 
import { Person } from '../../firebase/models/person';
import { deletePerson } from '../../firebase/services/personCardService';

const PersonCard = ({
  person,
  onPersonDeleted,
  isModal = false,
  showDeleteConfirm = false,
  setShowDeleteConfirm,
}: {
  person: Person;
  onPersonDeleted?: () => void;
  isModal?: boolean;
  showDeleteConfirm?: boolean;
  setShowDeleteConfirm?: (show: boolean) => void;
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

  // Use showDeleteConfirm from props if provided
  const confirmOpen = typeof showDeleteConfirm === 'boolean' ? showDeleteConfirm : showConfirm;

  const content = isModal ? (
    <>
      <div className="w-full flex flex-col items-center mb-4">
        <img
          src={presentImg}
          alt={"present"}
          className="w-24 h-24 rounded-full mb-2 shadow-lg object-cover bg-orange-50 border-4 border-orange-100"
        />
        <h3 className="text-2xl font-extrabold mb-1 text-orange-600 font-poppins text-center">{person.name}</h3>
      </div>
      <div className="w-full flex flex-col gap-4 items-center">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 w-full max-w-xs mx-auto">
          <div className="font-semibold text-gray-500 text-right pr-2">Gender:</div>
          <div className="text-left">{person.gender ? (person.gender.charAt(0).toUpperCase() + person.gender.slice(1)) : "Unknown"}</div>
          <div className="font-semibold text-gray-500 text-right pr-2">Age:</div>
          <div className="text-left">{person.age || "-"}</div>
          <div className="font-semibold text-gray-500 text-right pr-2">Budget:</div>
          <div className="text-left">${person.budgetMin} - ${person.budgetMax}</div>
          <div className="font-semibold text-gray-500 text-right pr-2">Previous presents:</div>
          <div className="text-left">{person.previousPresents || "-"}</div>
        </div>
        <div className="border-t border-orange-100 my-2 w-full max-w-xs mx-auto"></div>
        <div className="w-full max-w-xs mx-auto text-center">
          <div className="font-semibold text-gray-500 mb-1">Dates I need a present:</div>
          {person.datesINeedAPresent && person.datesINeedAPresent.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-700 inline-block text-left mx-auto">
              {person.datesINeedAPresent.map((x, i) => (
                <li key={i}>{`${x.day}/${x.month + 1}`}</li>
              ))}
            </ul>
          ) : <span className="text-gray-400 text-sm">None</span>}
        </div>
        <div className="border-t border-orange-100 my-2 w-full max-w-xs mx-auto"></div>
        <div className="w-full max-w-xs mx-auto text-center">
          <div className="font-semibold text-gray-500 mb-1">Interests:</div>
          {person.interests ? (
            <div className="flex flex-wrap gap-2 bg-blue-50/60 rounded-lg p-2 justify-center">
              {person.interests.split(", ").map((tag, idx) => (
                <span key={tag + '-' + idx} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">{tag}</span>
              ))}
            </div>
          ) : <span className="text-gray-400 text-sm">None</span>}
        </div>
        <div className="w-full max-w-xs mx-auto text-center">
          <div className="font-semibold text-gray-500 mb-1">Brands:</div>
          {person.brands ? (
            <div className="flex flex-wrap gap-2 bg-green-50/60 rounded-lg p-2 justify-center">
              {person.brands.split(", ").map((brand, idx) => (
                <span key={brand + '-' + idx} className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">{brand}</span>
              ))}
            </div>
          ) : <span className="text-gray-400 text-sm">None</span>}
        </div>
      </div>
      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl border border-orange-200 w-full max-w-xs relative animate-fadeIn">
            <p className="mb-4 text-gray-900 text-base font-semibold">Are you sure you want to delete <strong>{person.name}</strong>?</p>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                onClick={() => {
                  setShowConfirm(false);
                  if (setShowDeleteConfirm) setShowDeleteConfirm(false);
                }}
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
  ) : (
    <>
      <img
        src={presentImg}
        alt={"present"}
        className="w-24 h-24 rounded-full mb-4 shadow-lg object-cover bg-orange-50"
      />
      <h3 className="text-xl font-bold mb-2 text-orange-700">{person.name}</h3>
      <div className="text-sm text-gray-700 w-full flex flex-col gap-1">
        <p><strong>Gender:</strong> {person.gender ? (person.gender.charAt(0).toUpperCase() + person.gender.slice(1)) : "Unknown"}</p>
        <p><strong>Age:</strong> {person.age || "-"}</p>
        <p><strong>Budget:</strong> ${person.budgetMin} - ${person.budgetMax}</p>
        <p><strong>Previous presents:</strong> {person.previousPresents || "-"}</p>
        <div><strong>Dates I need a present:</strong> {person.datesINeedAPresent && person.datesINeedAPresent.length > 0 ? (
          <ul className="list-disc list-inside ml-4">
            {person.datesINeedAPresent.map((x, i) => (
              <li key={i}>{`${x.day}/${x.month + 1}`}</li>
            ))}
          </ul>
        ) : "None"}</div>
        <div><strong>Interests:</strong> {person.interests ? (
          <div className="flex flex-wrap gap-2 mt-1">
            {person.interests.split(", ").map((tag, idx) => (
              <span key={tag + '-' + idx} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs">{tag}</span>
            ))}
          </div>
        ) : "None"}</div>
        <div><strong>Brands:</strong> {person.brands ? (
          <div className="flex flex-wrap gap-2 mt-1">
            {person.brands.split(", ").map((brand, idx) => (
              <span key={brand + '-' + idx} className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">{brand}</span>
            ))}
          </div>
        ) : "None"}</div>
      </div>
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