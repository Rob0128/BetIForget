import { collection, addDoc, getDocs } from "firebase/firestore";
import { FirebaseFirestore } from "../index";
import { Person } from "../models/person";
import { doc, deleteDoc } from "firebase/firestore";

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
      id: doc.id,
      name: data.name,
      datesINeedAPresent: data.datesINeedAPresent,
      previousPresents: data.previousPresents,
      age: data.age,
      gender: data.gender,
      budgetMin: data.budgetMin,
      budgetMax: data.budgetMax,
      interests: data.interests,
      userId: data.userId,
    } as Person;
  });
};

export const deletePerson = async (person: Person & { id?: string }) => {
  if (!person.id) throw new Error("Missing person id");
  await deleteDoc(doc(FirebaseFirestore, "personCards", person.id));
};