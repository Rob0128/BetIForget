import { collection, addDoc, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
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
      brands: data.brands, // <-- FIX: include brands field
    } as Person;
  });
};

export const deletePerson = async (person: Person & { id?: string }) => {
  if (!person.id) throw new Error("Missing person id");
  await deleteDoc(doc(FirebaseFirestore, "personCards", person.id));
};

// Update an existing PersonCard
export const updatePerson = async (person: Person & { id?: string }) => {
  if (!person.id) throw new Error("Missing person id");
  const { id, ...personData } = person;
  await setDoc(doc(FirebaseFirestore, "personCards", id), personData);
};

// Tag persistence
const TAGS_DOC_ID = "global_interest_tags"; // changed to avoid conflict

export const getAllTags = async (): Promise<string[]> => {
  const tagsDoc = await getDocs(collection(FirebaseFirestore, "tags"));
  if (!tagsDoc.empty) {
    // Only one doc expected
    const docData = tagsDoc.docs.find(doc => doc.id === TAGS_DOC_ID)?.data() || tagsDoc.docs[0].data();
    return docData.tags || [];
  }
  return [];
};

export const saveTags = async (tags: string[]) => {
  // Save to a single doc in the 'tags' collection
  await setDoc(doc(FirebaseFirestore, "tags", TAGS_DOC_ID), { tags });
};

// Brand persistence
const BRANDS_DOC_ID = "global_brand_tags"; // changed to avoid conflict

export const getAllBrands = async (): Promise<string[]> => {
  const brandsDoc = await getDocs(collection(FirebaseFirestore, "brands"));
  if (!brandsDoc.empty) {
    // Only one doc expected
    const docData = brandsDoc.docs.find(doc => doc.id === BRANDS_DOC_ID)?.data() || brandsDoc.docs[0].data();
    return docData.brands || [];
  }
  return [];
};

export const saveBrands = async (brands: string[]) => {
  // Save to a single doc in the 'brands' collection
  await setDoc(doc(FirebaseFirestore, "brands", BRANDS_DOC_ID), { brands });
};