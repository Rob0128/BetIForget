import { useState, useRef, useEffect } from "react";
import { Person, Gender } from '../../firebase/models/person';
import { addPerson, getAllTags, saveTags, getAllBrands, saveBrands } from '../../firebase/services/personCardService';
import { useUser } from "../../context/AuthContext";

// Example initial tag list
const DEFAULT_TAGS = [
  "Books", "Music", "Sports", "Cooking", "Travel", "Tech", "Fashion", "Fitness", "Outdoors", "Movies", "Art", "Photography", "Gaming", "Gardening", "Pets", "DIY", "Science", "History", "Cars", "Food", "Crafts", "Collecting", "Writing", "Dancing", "Yoga"
];

// Example initial brands list
const DEFAULT_BRANDS = [
  "Nike", "Adidas", "Apple", "Samsung", "Sony", "Microsoft", "Amazon", "Google", "Lego", "Disney", "Starbucks", "Gucci", "Louis Vuitton", "Chanel", "Prada", "Zara", "H&M", "Uniqlo", "North Face", "Patagonia", "Columbia", "Under Armour", "Puma", "Reebok", "New Balance", "Vans", "Converse", "Crocs", "Ray-Ban", "Fossil", "Coach", "Tiffany", "Pandora", "Swarovski", "Estee Lauder", "Sephora", "MAC", "Clinique", "Dyson", "KitchenAid", "Le Creuset", "Yeti", "Stanley", "Canon", "GoPro", "Fitbit", "Garmin", "Nintendo", "Xbox", "PlayStation", "Lush", "Bath & Body Works", "Victoria's Secret", "Lindt", "Godiva", "Swarovski", "Smeg", "Bose", "Beats", "JBL", "Polaroid", "Instax", "Crocs", "Birkenstock", "Dr. Martens", "Timberland", "Skechers", "Superdry", "Superga", "Guess", "Tommy Hilfiger", "Calvin Klein", "Levi's", "Gap", "Old Navy", "Abercrombie", "Hollister", "Jack Wills", "Barbour", "Moncler", "Canada Goose", "Lacoste", "Fred Perry", "Diesel", "Armani", "Versace", "Hermes", "Rolex", "Omega", "Tag Heuer", "Cartier", "Montblanc", "Sennheiser", "Marshall", "Logitech", "Anker", "Belkin", "Philips", "Braun", "Oral-B", "Gillette", "Nivea", "Dove", "L'Oreal", "Garnier", "Vichy", "Aveeno", "Neutrogena", "Olay", "Vaseline", "Johnson & Johnson", "Colgate", "Sensodyne", "Oral-B", "Schick", "Wilkinson Sword", "Gillette", "Remington", "Braun", "Panasonic", "Rowenta", "Tefal", "Russell Hobbs", "Kenwood", "Bosch", "De'Longhi", "Nespresso", "Keurig", "Tassimo", "Illy", "Lavazza", "Twinings", "Whittard", "Fortnum & Mason", "Harrods", "Selfridges", "Marks & Spencer", "Tesco", "Sainsbury's", "Waitrose", "Aldi", "Lidl", "Costco", "Walmart", "Target", "Best Buy", "Home Depot", "IKEA", "Wayfair", "Argos", "B&Q", "Screwfix", "Wickes", "Wilko", "Boots", "Superdrug", "Walgreens", "CVS", "Rite Aid", "Duane Reade", "Whole Foods", "Trader Joe's", "Morrisons", "Asda", "Co-op", "Spar", "Budgens", "Costcutter", "Premier", "One Stop", "Londis", "McDonald's", "Burger King", "KFC", "Subway", "Domino's", "Pizza Hut", "Papa John's", "Greggs", "Pret", "Costa Coffee", "Caffe Nero", "Dunkin' Donuts", "Krispy Kreme", "Five Guys", "Shake Shack", "Wendy's", "Taco Bell", "Chipotle", "Nando's", "Wagamama", "Yo! Sushi", "Itsu", "PizzaExpress", "Zizzi", "Ask Italian", "Bella Italia", "Frankie & Benny's", "Harvester", "Beefeater", "TGI Friday's", "Miller & Carter", "Toby Carvery", "Sizzler", "Outback", "Red Lobster", "Olive Garden", "Cheesecake Factory", "IHOP", "Denny's", "Applebee's", "Chili's", "Ruby Tuesday", "Buffalo Wild Wings", "Panera Bread", "Au Bon Pain", "Pret A Manger", "Le Pain Quotidien", "EAT", "Leon", "Shake Shack", "In-N-Out", "Carl's Jr.", "Hardee's", "Jack in the Box", "A&W", "Sonic", "Whataburger", "White Castle", "Culver's", "Steak 'n Shake", "Freddy's", "Checkers", "Rally's", "Krystal", "Cook Out", "Bojangles", "Raising Cane's", "Zaxby's", "Pollo Tropical", "El Pollo Loco", "Church's Chicken", "Wingstop", "Buffalo Wings & Rings", "Hooters", "WingStreet", "Bonchon", "Jollibee", "Chick-fil-A", "Pollo Campero", "Boston Market", "Krispy Kreme", "Tim Hortons", "Dairy Queen", "Baskin Robbins", "Cold Stone Creamery", "Ben & Jerry's", "Haagen-Dazs", "Breyers", "Magnum", "Walls", "Carte D'Or", "Cornetto", "Solero", "Twister", "Feast", "Calippo", "Mini Milk", "Rocket", "Fab", "Zoom", "Nobbly Bobbly", "Funny Feet", "Screwball", "Mr. Whippy", "99 Flake", "Choc Ice", "Viennetta", "Arctic Roll", "Angel Delight", "Ambrosia", "Bird's Custard", "Hartley's", "Rowntree's", "Jelly Babies", "Wine Gums", "Fruit Pastilles", "Fruit Gums", "Tooty Frooties", "Smarties", "Aero", "KitKat", "Yorkie", "Rolo", "Munchies", "Milkybar", "Caramac", "Lion Bar", "Toffee Crisp", "Crunch", "Dairy Milk", "Wispa", "Twirl", "Flake", "Curly Wurly", "Fudge", "Chomp", "Double Decker", "Boost", "Starbar", "Picnic", "Time Out", "Turkish Delight", "Bournville", "Green & Black's", "Galaxy", "Ripple", "Minstrels", "Maltesers", "Revels", "Mars", "Snickers", "Bounty", "Milky Way", "Twix", "Topic", "Celebrations", "Skittles", "M&M's", "Smarties", "Rowntree's", "Fruit Pastilles", "Fruit Gums", "Tooty Frooties", "Jelly Tots", "Polos", "Tic Tac", "Fisherman's Friend", "Halls", "Ricola", "Lockets", "Tunes", "Soothers", "Strepsils", "Covonia", "Lemsip", "Beechams", "Night Nurse", "Day Nurse", "Sudafed", "Vicks", "Olbas Oil", "Karvol", "Mentholatum", "Tiger Balm", "Deep Heat", "Voltarol", "Ibuleve", "Nurofen", "Anadin", "Panadol", "Paracetamol", "Aspirin", "Alka-Seltzer", "Rennie", "Gaviscon", "Andrews", "Milk of Magnesia", "Senokot", "Dulcolax", "Movicol", "Fybogel", "Imodium", "Dioralyte", "Rehydration Sachets", "Calpol", "Bonjela", "Teething Gel", "Sudocrem", "Bepanthen", "Metanium", "Desitin", "Vaseline", "E45", "Aveeno", "Oilatum", "Cetraben", "Doublebase", "Diprobase", "Hydromol", "Zerobase", "Zeroderm", "Zeroveen", "Zerocream", "Zeroguent", "Zerolatum", "Zeromol", "Zeromol Cream", "Zeromol Ointment", "Zeromol Lotion", "Zeromol Gel", "Zeromol Spray", "Zeromol Shampoo", "Zeromol Bath Additive", "Zeromol Emollient", "Zeromol Barrier Cream", "Zeromol Barrier Ointment", "Zeromol Barrier Lotion", "Zeromol Barrier Gel", "Zeromol Barrier Spray", "Zeromol Barrier Shampoo", "Zeromol Barrier Bath Additive", "Zeromol Barrier Emollient", "Zeromol Barrier Cream", "Zeromol Barrier Ointment", "Zeromol Barrier Lotion", "Zeromol Barrier Gel", "Zeromol Barrier Spray", "Zeromol Barrier Shampoo", "Zeromol Barrier Bath Additive", "Zeromol Barrier Emollient"
];

const AddPersonCard = ({ onPersonAdded }: { onPersonAdded: () => void }) => {
  const { user, isLoading } = useUser();
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [allTags, setAllTags] = useState<string[]>(dedupeCaseInsensitive(DEFAULT_TAGS));
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
  const [brands, setBrands] = useState<string[]>([]);
  const [brandInput, setBrandInput] = useState("");
  const [allBrands, setAllBrands] = useState<string[]>(dedupeCaseInsensitive(DEFAULT_BRANDS));

  // Load tags and brands from Firestore on mount
  useEffect(() => {
    getAllTags().then(tags => {
      if (tags.length > 0) setAllTags(dedupeCaseInsensitive(tags));
    });
    getAllBrands().then(brands => {
      if (brands.length > 0) setAllBrands(dedupeCaseInsensitive(brands));
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

  // List of basic offensive words (expand as needed)
  const OFFENSIVE_WORDS = [
    "fuck", "shit", "bitch", "asshole", "bastard", "dick", "cunt", "piss", "slut", "whore", "fag", "nigger", "nigga", "coon", "retard", "crap", "damn", "hell", "wank", "twat", "prick", "cock", "pussy", "bollocks", "arse", "bugger", "douche"
  ];

  // Helper: Validate interest
  function isValidInterest(tag: string): string | null {
    const trimmed = tag.trim();
    if (!trimmed) return "Interest cannot be empty.";
    if (trimmed.split(/\s+/).length > 2) return "Interest must be no more than 2 words.";
    if (/[^a-zA-Z0-9\s]/.test(trimmed)) return "Interest cannot contain special characters.";
    const lower = trimmed.toLowerCase();
    if (OFFENSIVE_WORDS.some(word => lower.includes(word))) return "Interest contains inappropriate language.";
    return null;
  }

  const handleAddInterest = async (tag: string) => {
    const validationError = isValidInterest(tag);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!tag.trim() || interests.some(t => t.trim().toLowerCase() === tag.trim().toLowerCase())) return;
    const newInterests = dedupeCaseInsensitive([...interests, tag]);
    setInterests(newInterests);
    if (!allTags.some(t => t.trim().toLowerCase() === tag.trim().toLowerCase())) {
      const newTags = dedupeCaseInsensitive([...allTags, tag]);
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

  const filteredTags = interestInput
    ? dedupeCaseInsensitive(allTags.filter(
        t => t.toLowerCase().includes(interestInput.toLowerCase()) && !interests.includes(t)
      ))
    : dedupeCaseInsensitive(allTags.filter(t => !interests.includes(t)));

  // Helper: Validate brand
  function isValidBrand(brand: string): string | null {
    const trimmed = brand.trim();
    if (!trimmed) return "Brand cannot be empty.";
    if (trimmed.split(/\s+/).length > 2) return "Brand must be no more than 2 words.";
    if (/[^a-zA-Z0-9\s]/.test(trimmed)) return "Brand cannot contain special characters.";
    const lower = trimmed.toLowerCase();
    if (OFFENSIVE_WORDS.some(word => lower.includes(word))) return "Brand contains inappropriate language.";
    return null;
  }

  const handleAddBrand = async (brand: string) => {
    const validationError = isValidBrand(brand);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!brand.trim() || brands.some(b => b.trim().toLowerCase() === brand.trim().toLowerCase())) return;
    const newBrands = dedupeCaseInsensitive([...brands, brand]);
    setBrands(newBrands);
    if (!allBrands.some(b => b.trim().toLowerCase() === brand.trim().toLowerCase())) {
      const updatedBrands = dedupeCaseInsensitive([...allBrands, brand]);
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

  const filteredBrands = brandInput
    ? dedupeCaseInsensitive(allBrands.filter(
        b => b.toLowerCase().includes(brandInput.toLowerCase()) && !brands.includes(b)
      ))
    : dedupeCaseInsensitive(allBrands.filter(b => !brands.includes(b)));

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
      const validationError = isValidInterest(interestInput.trim());
      if (validationError) {
        setError(validationError);
        return;
      }
      newInterests.push(interestInput.trim());
      // Also add to tags in Firestore
      if (!allTags.includes(interestInput.trim())) {
        const updatedTags = [...allTags, interestInput.trim()];
        setAllTags(updatedTags);
        await saveTags(updatedTags);
      }
    }
    // Auto-add current brand input if not empty and not already in brands
    let newBrands = [...brands];
    if (brandInput.trim() && !newBrands.includes(brandInput.trim())) {
      const validationError = isValidBrand(brandInput.trim());
      if (validationError) {
        setError(validationError);
        return;
      }
      newBrands.push(brandInput.trim());
      // Also add to brands in Firestore
      if (!allBrands.includes(brandInput.trim())) {
        const updatedBrands = [...allBrands, brandInput.trim()];
        setAllBrands(updatedBrands);
        await saveBrands(updatedBrands);
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
      brands: newBrands.join(", "),
      userId: user.uid
    };
    try {
      await addPerson(person);
      setShowPopup(false);
      setName("");
      setInterests([]);
      setInterestInput("");
      setBrands([]);
      setBrandInput("");
      // Don't reset allTags or allBrands, keep the latest from Firestore
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

  // Instead of early return, use conditional rendering in the return statement
  if (isLoading || !user) {
    return <div>{isLoading ? "Loading..." : "Please log in"}</div>;
  }

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

// Deduplicate helper (case-insensitive)
function dedupeCaseInsensitive(arr: string[]): string[] {
  const seen = new Set<string>();
  return arr.filter(item => {
    const lower = item.trim().toLowerCase();
    if (seen.has(lower)) return false;
    seen.add(lower);
    return true;
  });
}