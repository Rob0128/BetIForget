import { useState } from "react";
import presentImg from '../../assets/present.png'; 
import { Person } from '../../firebase/models/person';
import { addPerson } from '../../firebase/services/personCardService';
import { useUser } from "../../context/AuthContext";

const AddPersonCard = ({ onPersonAdded }: { onPersonAdded: () => void }) => {
  const { user, isLoading } = useUser();
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState("");
  const [interests, setInterests] = useState("");
  const [previousPresents, setPreviousPresents] = useState("");
  const [dates, setDates] = useState<{ month: number; day: number }[]>([]);
  const [month, setMonth] = useState<number>(0);
  const [day, setDay] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  const handleAddDate = () => {
    if (
      !dates.some(d => d.month === month && d.day === day) &&
      day > 0 && day <= 31 && month >= 0 && month <= 11
    ) {
      setDates([...dates, { month, day }]);
    }
  };

  const handleRemoveDate = (idx: number) => {
    setDates(dates.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setError(null);
    const person: Person = {
      name,
      datesINeedAPresent: dates,
      previousPresents,
      interests,
      userId: user.uid
    };
    try {
      await addPerson(person);
      setShowPopup(false);
      setName("");
      setInterests("");
      setPreviousPresents("");
      setDates([]);
      onPersonAdded();
    } catch (error) {
      setError("Failed to add person.");
      console.error("Add person failed:", error);
    }
  };

  return (
    <div className="max-w-sm w-full mx-auto bg-white rounded-2xl shadow-md overflow-hidden flex flex-col items-center p-6 text-gray-900">
      <img
        src={presentImg}
        alt={"present"}
        className="w-24 h-24 rounded-full shadow mb-4"
      />
      <h2 className="text-xl font-semibold">Add person</h2>
      <div className="text-sm">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={() => setShowPopup(true)}
        >
          Add Person
        </button>
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPopup(false)}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4">New Person</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Name"
                className="border rounded px-2 py-1"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Interests"
                className="border rounded px-2 py-1"
                value={interests}
                onChange={e => setInterests(e.target.value)}
              />
              <input
                type="text"
                placeholder="Previous Presents"
                className="border rounded px-2 py-1"
                value={previousPresents}
                onChange={e => setPreviousPresents(e.target.value)}
              />
              <div>
                <div className="flex gap-2 items-center mb-2">
                  <select
                    value={month}
                    onChange={e => setMonth(Number(e.target.value))}
                    className="border rounded px-2 py-1"
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <option key={i} value={i}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={day}
                    onChange={e => setDay(Number(e.target.value))}
                    className="border rounded px-2 py-1 w-16"
                  />
                  <button
                    type="button"
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={handleAddDate}
                  >
                    Add Date
                  </button>
                </div>
                <ul className="list-disc list-inside">
                  {dates.map((d, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {`${d.day}/${d.month + 1}`}
                      <button
                        type="button"
                        className="text-red-500 ml-2"
                        onClick={() => handleRemoveDate(i)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {error && <div className="text-red-500">{error}</div>}
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2"
              >
                Save Person
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPersonCard;