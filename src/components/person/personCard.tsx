import presentImg from '../../assets/present.png'; 
import { Person } from '../../firebase/models/person';

const PersonCard = ({ person }: { person: Person }) => {
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
    </div>
  );
};

export default PersonCard;