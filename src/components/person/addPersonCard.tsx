import { useState, useRef, useEffect } from "react";
import { Person, Gender } from '../../firebase/models/person';
import { addPerson, getAllTags, saveTags } from '../../firebase/services/personCardService';
import { useUser } from "../../context/AuthContext";

// Example initial tag list
const DEFAULT_TAGS = [
  "Books", "Music", "Sports", "Cooking", "Travel", "Tech", "Fashion", "Fitness", "Outdoors", "Movies", "Art", "Photography", "Gaming", "Gardening", "Pets", "DIY", "Science", "History", "Cars", "Food", "Crafts", "Collecting", "Writing", "Dancing", "Yoga"
];

const AddPersonCard = ({ onPersonAdded }: { onPersonAdded: () => void }) => {
  const { user, isLoading } = useUser();
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [allTags, setAllTags] = useState<string[]>(DEFAULT_TAGS);
  const [age, setAge] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [gender, setGender] = useState<Gender>("other");
  const [previousPresents, setPreviousPresents] = useState("");
  const [dates, setDates] = useState<{ month: number; day: number }[]>([]);
  const [month, setMonth] = useState<number>(0);
  const [day, setDay] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  // Load tags from Firestore on mount
  useEffect(() => {
    getAllTags().then(tags => {
      if (tags.length > 0) setAllTags(tags);
    });
  }, []);

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

  const handleAddInterest = async (tag: string) => {
    if (!tag.trim() || interests.includes(tag)) return;
    setInterests([...interests, tag]);
    if (!allTags.includes(tag)) {
      const newTags = [...allTags, tag];
      setAllTags(newTags);
      await saveTags(newTags);
    }
    setInterestInput("");
    if (inputRef.current) inputRef.current.focus();
  };

  const handleRemoveInterest = (tag: string) => {
    setInterests(interests.filter(t => t !== tag));
  };

  const filteredTags = interestInput
    ? allTags.filter(
        t => t.toLowerCase().includes(interestInput.toLowerCase()) && !interests.includes(t)
      )
    : allTags.filter(t => !interests.includes(t));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    // Budget validation
    const min = Number(budgetMin);
    const max = Number(budgetMax);
    if (!Number.isInteger(min) || min <= 0) {
      setError("Budget min must be a positive whole number.");
      return;
    }
    if (!Number.isInteger(max) || max <= 0) {
      setError("Budget max must be a positive whole number.");
      return;
    }
    if (min >= max) {
      setError("Budget min must be less than budget max.");
      return;
    }
    // Auto-add current input if not empty and not already in interests
    let newInterests = [...interests];
    if (interestInput.trim() && !newInterests.includes(interestInput.trim())) {
      newInterests.push(interestInput.trim());
      // Also add to tags in Firestore
      if (!allTags.includes(interestInput.trim())) {
        const updatedTags = [...allTags, interestInput.trim()];
        setAllTags(updatedTags);
        await saveTags(updatedTags);
      }
    }
    setError(null);
    const person: Person = {
      name,
      datesINeedAPresent: dates,
      previousPresents,
      age,
      gender,
      budgetMin: min,
      budgetMax: max,
      interests: newInterests.join(", "),
      userId: user.uid
    };
    try {
      await addPerson(person);
      setShowPopup(false);
      setName("");
      setInterests([]);
      setInterestInput("");
      // Don't reset allTags, keep the latest from Firestore
      setPreviousPresents("");
      setGender("other");
      setAge("");
      setBudgetMin("");
      setBudgetMax("");
      setDates([]);
      onPersonAdded();
    } catch (error) {
      setError("Failed to add person.");
      console.error("Add person failed:", error);
    }
  };

  return (
    <>
      {/* Card */}
      <div className="max-w-sm w-full mx-auto flex flex-col items-center p-6 text-gray-900">
        <div
          className="max-w-sm w-full mx-auto bg-white rounded-2xl shadow-md overflow-hidden flex flex-col items-center p-6 text-gray-900 cursor-pointer transition hover:shadow-lg"
          onClick={() => setShowPopup(true)}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") setShowPopup(true);
          }}
          aria-label="Add person"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-700/75 text-white text-3xl mb-2 shadow transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Add person</h2>
        </div>
      </div>
      {/* Modal */}
      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/75 bg-opacity-40 z-50"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="max-w-sm w-full mx-auto bg-white rounded-2xl shadow-md overflow-hidden flex flex-col items-center p-6 text-gray-900 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPopup(false)}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4">New Person</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full"> 
              <input
                type="text"
                placeholder="Name"
                className="border rounded px-2 py-1"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              {/* Interests tag input */}
              <div>
                <label className="block mb-1 font-medium">Interests</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {interests.map(tag => (
                    <span key={tag} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full flex items-center">
                      {tag}
                      <button
                        type="button"
                        className="ml-1 text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveInterest(tag)}
                        aria-label={`Remove ${tag}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    className="border rounded px-2 py-1 w-full"
                    placeholder="Type to search or add..."
                    value={interestInput}
                    onChange={e => setInterestInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && interestInput.trim()) {
                        e.preventDefault();
                        handleAddInterest(interestInput.trim());
                      }
                    }}
                  />
                  {interestInput && filteredTags.length > 0 && (
                    <ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-32 overflow-y-auto shadow">
                      {filteredTags.map(tag => (
                        <li
                          key={tag}
                          className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                          onClick={() => handleAddInterest(tag)}
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {interestInput && filteredTags.length === 0 && (
                  <div className="text-xs text-gray-500 mt-1">Press Enter to add "{interestInput}"</div>
                )}
              </div>
              <select
                className="border rounded px-2 py-1"
                value={gender}
                onChange={e => setGender(e.target.value as Gender)}
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Age"
                className="border rounded px-2 py-1"
                value={age}
                onChange={e => setAge(e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Budget Min"
                  className="border rounded px-2 py-1 w-1/2"
                  value={budgetMin}
                  onChange={e => setBudgetMin(e.target.value)}
                  min={1}
                  required
                />
                <input
                  type="number"
                  placeholder="Budget Max"
                  className="border rounded px-2 py-1 w-1/2"
                  value={budgetMax}
                  onChange={e => setBudgetMax(e.target.value)}
                  min={1}
                  required
                />
              </div>
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
                    className="bg-green-500 text-white px-2 py-1 rounded cursor-pointer hover:bg-green-600"
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
    </>
  );
};

export default AddPersonCard;