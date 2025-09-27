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
    // Date validation - at least one date is required
    if (dates.length === 0) {
      setError("At least one important date is required so we can send you reminders.");
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
      userId: user ? user.uid : "",
      email: user?.email || "", 
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
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-orange-200 text-gray-900 relative animate-fadeIn max-h-[90vh] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex-shrink-0 p-6 sm:p-8 pb-4 relative">
              <button
                className="absolute top-3 right-3 text-orange-400 hover:text-orange-600 text-2xl font-bold bg-orange-50 rounded-full w-9 h-9 flex items-center justify-center shadow border border-orange-100 transition"
                onClick={() => setShowPopup(false)}
                aria-label="Close"
              >
                ×
              </button>
              <h3 className="text-2xl font-extrabold mb-2 text-orange-500">New Person</h3>
              <p className="text-gray-600 text-sm text-center">Add someone important to you and we'll help you remember their special dates</p>
            </div>
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 pb-6 sm:pb-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sarah Johnson"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              {/* Interests tag input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Interests</label>
                <p className="text-xs text-gray-500">What do they like? This helps us suggest better gifts</p>
                <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Type to search or add interests..."
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
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Favorite Brands</label>
                <p className="text-xs text-gray-500">Brands they love - helps narrow down gift ideas</p>
                <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Type to search or add brands..."
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    value={gender}
                    onChange={e => setGender(e.target.value as Gender)}
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <input
                    type="text"
                    placeholder="25"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Budget Range <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500">How much do you typically spend on gifts for them?</p>
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Min ($)"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      value={budgetMin}
                      onChange={e => setBudgetMin(e.target.value)}
                      min={1}
                      required
                    />
                  </div>
                  <span className="text-gray-400 font-medium">to</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Max ($)"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      value={budgetMax}
                      onChange={e => setBudgetMax(e.target.value)}
                      min={1}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Previous Presents</label>
                <p className="text-xs text-gray-500">What have you given them before? Helps avoid repeats</p>
                <textarea
                  placeholder="e.g., Watch (2023), Book collection (2022)..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                  value={previousPresents}
                  onChange={e => setPreviousPresents(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Important Dates <span className="text-red-500">*</span>
                </label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <div className="flex items-start gap-2 mb-2">
                    <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-blue-700">
                      Add important dates like birthdays or anniversaries. We'll send you reminders before these dates so you never forget to get a gift!
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Month</label>
                      <select
                        value={month}
                        onChange={e => setMonth(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {Array.from({ length: 12 }).map((_, i) => (
                          <option key={i} value={i}>
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-20">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Day</label>
                      <input
                        type="number"
                        min={1}
                        max={31}
                        value={day}
                        onChange={e => setDay(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center"
                      />
                    </div>
                    <button
                      type="button"
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                      onClick={handleAddDate}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add
                    </button>
                  </div>
                {dates.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-600">Added Dates:</p>
                    <div className="space-y-2">
                      {dates.map((d, i) => (
                        <div key={i} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200">
                          <span className="text-sm font-medium text-gray-700">
                            {new Date(0, d.month).toLocaleString('default', { month: 'long' })} {d.day}
                          </span>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                            onClick={() => handleRemoveDate(i)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Save Person
                </button>
              </div>
              </form>
            </div>
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