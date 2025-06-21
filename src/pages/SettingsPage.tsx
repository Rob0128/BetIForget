import { useState } from "react";
import { useUser } from "../context/AuthContext";

const SettingsPage = () => {
  const { user } = useUser();
  const [email, setEmail] = useState(user?.email || "");
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");
  // Placeholder for preferences
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    darkMode: false,
  });

  // Placeholder for update logic
  const handleSave = async () => {
    setStatus("Saving...");
    // TODO: Implement update logic (Firebase update, etc.)
    setTimeout(() => {
      setStatus("Saved!");
      setEditing(false);
    }, 1000);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-lg text-gray-500">
        Please sign in to view your settings.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white rounded-2xl shadow-xl p-8 border border-orange-100 flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-orange-600 mb-2 font-poppins">Account Settings</h2>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">Email Address</label>
        {editing ? (
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border border-orange-200 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        ) : (
          <span className="text-base text-gray-800">{user.email}</span>
        )}
      </div>
      {/* <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">Preferences</label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={e => setPreferences(p => ({ ...p, emailNotifications: e.target.checked }))}
              className="accent-orange-500"
              disabled={!editing}
            />
            <span>Email Notifications</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.darkMode}
              onChange={e => setPreferences(p => ({ ...p, darkMode: e.target.checked }))}
              className="accent-orange-500"
              disabled={!editing}
            />
            <span>Dark Mode</span>
          </label>
        </div>
      </div> */}
      <div className="flex gap-3 mt-4">
        {editing ? (
          <>
            <button
              className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-2 px-6 rounded-lg shadow transition text-lg"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg shadow transition text-lg"
              onClick={() => { setEditing(false); setEmail(user.email || ""); setStatus(""); }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-2 px-6 rounded-lg shadow transition text-lg"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        )}
        {status && <span className="ml-4 text-orange-500 font-semibold">{status}</span>}
      </div>
    </div>
  );
};

export default SettingsPage;
