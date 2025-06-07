import presentImg from '../../assets/present.png'; 
import { Person } from '../../firebase/models/person';
import { addPerson } from '../../firebase/services/personCardService';
import { useUser } from "../../context/AuthContext";

const AddPersonCard = () => {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  const handleAddPerson = async () => {
  const person: Person = {
    name: "New Person",
    datesINeedAPresent: [
      { month: 0, day: 2 },
      { month: 1, day: 14 },
      { month: 5, day: 6 },
      { month: 11, day: 25 }
    ].map(date => ({ month: Number(date.month), day: Number(date.day) })), // <-- Ensures plain numbers
    previousPresents: "None",
    interests: "None",
    userId: user.uid
  };

   try {
    await addPerson(person);  // 👈 IMPORTANT
    console.log("Person added successfully");
  } catch (error) {
    console.error("Add person failed:", error);  // 👈 Should finally show up
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
        <p><strong>Previous presents:</strong>Ey</p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={handleAddPerson}
        >
          Add Person
        </button>
      </div>
    </div>
  );
};

export default AddPersonCard;