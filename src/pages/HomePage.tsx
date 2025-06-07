import { Link } from "react-router-dom";
import { useUser } from "../context/AuthContext";
import { FirebaseAuth } from "../firebase";
import PersonCard from "../components/person/personCard";
import AddPersonCard from "../components/person/addPersonCard";
import DisplayPeople from "../components/person/personDisplay";

const HomePage = () => {
  const { user } = useUser();

  return (
    <>
      <div className="flex flex-col items-center gap-y-12 px-4 py-8">
      <section className="max-w-md bg-neutral-800 rounded-lg p-6 mx-auto text-center shadow-lg">
        <h1 className="text-2xl font-bold mb-4">React Firebase Auth Template</h1>
        <p className="mb-4">Current User: {user?.email || "None"}</p>
        {user ? (
          <div className="flex flex-col gap-2 items-center">
            <button
              onClick={() => FirebaseAuth.signOut()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign Out
            </button>
            <Link
              to="/protected"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded text-center"
            >
              Protected Page 🛡️
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2 items-center">
            <Link
              to="/auth/sign-in"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded text-center"
            >
              Sign In
            </Link>
            <Link
              to="/protected"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded text-center"
            >
              Protected Page 🛡️
            </Link>
          </div>
        )}
      </section>

  {user && (
  <div className="w-full flex flex-wrap justify-center gap-6 px-4">
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex justify-center">
      <AddPersonCard />
      </div>
    <DisplayPeople />
  </div>
)}
</div>
    </>
  );
};

export default HomePage;
