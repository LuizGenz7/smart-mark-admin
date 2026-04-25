
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export const fetchUser = async (userId) => {
  const profileRef = doc(db, "admins", "schoolAdmins", "users", userId);
  const preferred = (await getDoc(profileRef)).data();
  return preferred;
}