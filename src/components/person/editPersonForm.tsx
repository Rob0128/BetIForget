import { useState, useRef, useEffect } from "react";
import { Person, Gender } from '../../firebase/models/person';
import { updatePerson, getAllTags, saveTags, getAllBrands, saveBrands } from '../../firebase/services/personCardService';
import { useUser } from "../../context/AuthContext";

const EditPersonForm = ({
  person,
  onSave,
  onCancel
}: {
  person: Person;
  onSave: () => void;
  onCancel: () => void;
}) => {
  const { user } = useUser();
  const [name, setName] = useState(person.name || "");
  const [interests, setInterests] = useState<string[]>(person.interests ? person.interests.split(", ") : []);
  const [interestInput, setInterestInput] = useState("");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [age, setAge] = useState(person.age || "");
  const [budgetMin, setBudgetMin] = useState(person.budgetMin?.toString() || "");
  const [budgetMax, setBudgetMax] = useState(person.budgetMax?.toString() || "");
  const [gender, setGender] = useState<Gender>(person.gender || "other");
  const [previousPresents, setPreviousPresents] = useState(person.previousPresents || "");
  const [dates, setDates] = useState<{ month: number; day: number }[]>(person.datesINeedAPresent || []);
  const [month, setMonth] = useState<number>(0);
  const [day, setDay] = useState<number>(1);
  const [brands, setBrands] = useState<string[]>(person.brands ? person.brands.split(", ") : []);
  const [brandInput, setBrandInput] = useState("");
  const [allBrands, setAllBrands] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAllTags().then(setAllTags);
    getAllBrands().then(setAllBrands);
  }, []);

  const handleAddInterest = async (tag: string) => {
    if (!tag.trim() || interests.some(t => t.trim().toLowerCase() === tag.trim().toLowerCase())) return;
    const newInterests = [...interests, tag];
    setInterests(newInterests);
    if (!allTags.some(t => t.trim().toLowerCase() === tag.trim().toLowerCase())) {
      const newTags = [...allTags, tag];
      setAllTags(newTags);
      await saveTags(newTags);
    }
    setInterestInput("");
    setError(null);
    if (inputRef.current) inputRef.current.focus();
  };
  const handleRemoveInterest = (tag: string) => {
    setInterests(interests.filter(t => t !== tag));
  };
  const handleAddBrand = async (brand: string) => {
    if (!brand.trim() || brands.some(b => b.trim().toLowerCase() === brand.trim().toLowerCase())) return;
    const newBrands = [...brands, brand];
    setBrands(newBrands);
    if (!allBrands.some(b => b.trim().toLowerCase() === brand.trim().toLowerCase())) {
      const updatedBrands = [...allBrands, brand];
      setAllBrands(updatedBrands);
      await saveBrands(updatedBrands);
    }
    setBrandInput("");
    setError(null);
    if (inputRef.current) inputRef.current.focus();
  };
  const handleRemoveBrand = (brand: string) => {
    setBrands(brands.filter(b => b !== brand));
  };
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
    const updatedPerson: Person = {
      ...person,
      name,
      interests: interests.join(", "),
      brands: brands.join(", "),
      age,
      gender,
      budgetMin: min,
      budgetMax: max,
      previousPresents,
      datesINeedAPresent: dates,
    };
    try {
      await updatePerson(updatedPerson);
      onSave();
    } catch (err) {
      setError("Failed to update person.");
    }
  };
  const filteredTags = interestInput
    ? allTags.filter(
        t => t.toLowerCase().includes(interestInput.toLowerCase()) && !interests.includes(t)
      )
    : allTags.filter(t => !interests.includes(t));
  const filteredBrands = brandInput
    ? allBrands.filter(
        b => b.toLowerCase().includes(brandInput.toLowerCase()) && !brands.includes(b)
      )
    : allBrands.filter(b => !brands.includes(b));
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
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
          {interests.map((tag, idx) => (
            <span key={tag + '-' + idx} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full flex items-center">
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
              {filteredTags.map((tag, idx) => (
                <li
                  key={tag + '-' + idx}
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
      {/* Brands tag input */}
      <div>
        <label className="block mb-1 font-medium">Brands</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {brands.map((brand, idx) => (
            <span key={brand + '-' + idx} className="bg-green-200 text-green-800 px-2 py-1 rounded-full flex items-center">
              {brand}
              <button
                type="button"
                className="ml-1 text-red-500 hover:text-red-700"
                onClick={() => handleRemoveBrand(brand)}
                aria-label={`Remove ${brand}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            className="border rounded px-2 py-1 w-full"
            placeholder="Type to search or add..."
            value={brandInput}
            onChange={e => setBrandInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && brandInput.trim()) {
                e.preventDefault();
                handleAddBrand(brandInput.trim());
              }
            }}
          />
          {brandInput && filteredBrands.length > 0 && (
            <ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-32 overflow-y-auto shadow">
              {filteredBrands.map((brand, idx) => (
                <li
                  key={brand + '-' + idx}
                  className="px-2 py-1 hover:bg-green-100 cursor-pointer"
                  onClick={() => handleAddBrand(brand)}
                >
                  {brand}
                </li>
              ))}
            </ul>
          )}
        </div>
        {brandInput && filteredBrands.length === 0 && (
          <div className="text-xs text-gray-500 mt-1">Press Enter to add "{brandInput}"</div>
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
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-2 px-6 rounded-lg shadow transition text-lg"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditPersonForm;
