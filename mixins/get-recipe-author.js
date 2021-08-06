import generatePath from "../helpers/generatePath";

export default {
  data(){
    return {
      author: {}
    }
  },
  methods: {
    getRecipeAuthor(ownerID){
      this.$fire.database
        .ref(`users/${ownerID}/displayName`)
        .once("value", snapshot => {
          if (snapshot.exists()) {
            let author = snapshot.val();
            this.author =  {
              id: ownerID,
              displayName: author || "Unknown",
              path: author && generatePath(author, ownerID)
            };
          }
        });
    },
  }
}
