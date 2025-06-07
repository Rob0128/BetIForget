import { collection, addDoc, getDocs } from "firebase/firestore";
import { FirebaseFirestore } from "../index";
import { Person } from "../models/person";

// Add a new PersonCard
export const addPerson = async (card: Person) => {
  try {
    const docRef = await addDoc(collection(FirebaseFirestore, "personCards"), card);
    console.log("Person added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding person:", error);
    throw error;
  }
};

export const getPeople = async () => {
  const querySnapshot = await getDocs(collection(FirebaseFirestore, "personCards"));
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      // id: doc.id, // include if you want, but not required for Person
      name: data.name,
      datesINeedAPresent: data.datesINeedAPresent,
      previousPresents: data.previousPresents,
      interests: data.interests,
      userId: data.userId,
    } as Person;
  });
};