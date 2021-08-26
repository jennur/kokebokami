import generatePath from "~/helpers/generatePath";

export default function getRecipeOwner(snapshot, recipeOwnerID){
  let authorData = {
    displayName: "unknown",
    path: "",
    id: recipeOwnerID
  };

  if(snapshot.val()) {
    let displayName = snapshot.val();
    authorData.displayName = displayName || "unknown";
    authorData.path = generatePath(displayName, recipeOwnerID);
  }
  return {
    content: authorData,
    structuredData: {
        "@type": "Person",
        name: authorData.displayName,
        url: `https://kokebokami.com/cooks/${authorData.path}`
    },
  }
}
