import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { FirebaseAuth } from "../firebase";
import LoadingPage from "../pages/LoadingPage";

export const UserDataContext = createContext<{
  user: User | null;
  isLoading: boolean;
}>({
  user: null,
  isLoading: true
});

export const useUser = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
};

type Props = { children: React.ReactNode };
export const UserDataProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStateListener = onAuthStateChanged(FirebaseAuth, async (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => {
      authStateListener();
    };
  }, [FirebaseAuth]);

  return (
    <UserDataContext.Provider value={{ user, isLoading }}>
      {isLoading ? <LoadingPage /> : children}
    </UserDataContext.Provider>
  );
};
