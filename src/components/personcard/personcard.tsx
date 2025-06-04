
const PersonCard = () => {
  const person = {
    name: "Jane Doe",
    title: "Senior Product Designer",
    email: "jane.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg", // example image
  };

  return (
    <div className="max-w-sm w-full mx-auto bg-white rounded-2xl shadow-md overflow-hidden flex flex-col items-center p-6 text-gray-900">
      <img
        src={person.avatar}
        alt={person.name}
        className="w-24 h-24 rounded-full shadow mb-4"
      />
      <h2 className="text-xl font-semibold">{person.name}</h2>
      <p className="text-sm text-gray-500 mb-2">{person.title}</p>
      <div className="text-sm">
        <p className="mb-1"><strong>Email:</strong> {person.email}</p>
        <p className="mb-1"><strong>Phone:</strong> {person.phone}</p>
        <p><strong>Location:</strong> {person.location}</p>
      </div>
    </div>
  );
};

export default PersonCard;
