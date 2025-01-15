import { getDatabase, ref, get } from "firebase/database";
import generatePath from "../helpers/generatePath";

export default async function useRecipeAuthor(ownerID){
  const db = getDatabase();
  const snapshot = await get(ref(db, `users/${ownerID}/displayName`));

  if (snapshot.exists()) {
    let author = snapshot.val();
    return {
      id: ownerID,
      displayName: author || "Unknown",
      path: author && generatePath(author, ownerID)
    };
  }
}
