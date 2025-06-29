import { getDatabase, ref as dbRef, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import userModel from "../helpers/user-model";

export default async function useAllUsers() {
  const auth = getAuth();
  const db = getDatabase();

  const data = {
    users: [],
    errorMessage: null,
  };

  if (auth.currentUser) {
    try {
      const snapshot = await get(dbRef(db, "users"));
      if (snapshot.exists()) {
        data.users = Object.entries(snapshot.val())
          .filter((user) => !user[1].hiddenProfile)
          .map((user) => userModel(user[1], user[0]));
      }
    } catch (error) {
      console.error("[useAllUsers]", error.message);
      data.errorMessage =
        "Unable to load users. If the issue continues, please contact us.";
    }
  }

  return data;
}
