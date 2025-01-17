import { getDatabase, ref, get } from "firebase/database";
import generatePath from "../helpers/generatePath";

export default async function useRecipeAuthor(ownerID){
  const db = getDatabase();
  const snapshot = await get(ref(db, `users/${ownerID}/displayName`));

  const author = {
    id: ownerID,
    displayName: "",
    path: ""
  }

  if (snapshot.exists()) {
    const displayName = snapshot.val();
    author.displayName = displayName || "unknown";
    author.path = generatePath(displayName, ownerID);
  }
  return {
    content: author,
    structuredData: {
        "@type": "Person",
        name: author.displayName,
        url: `https://kokebokami.com/cooks/${author.path}`
    },
  }
}
