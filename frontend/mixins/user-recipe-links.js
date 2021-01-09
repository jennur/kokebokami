export default {
  methods: {
    async setRecipeLinks() {
      let currentUser = this.$fire.auth.currentUser;
      if (currentUser) {
        try {
          let snapshot = await this.$fire.database
            .ref(`users/${currentUser.uid}/recipeLinks`)
            .orderByKey()
            .once("value");

          let recipeLinks = [];
          if (snapshot.val()) {
            let links = snapshot.val();

            for(let key in links){
              let link = links[key];
              link.id = key;
              link.title = link.title || this.makeBackupTitle(link);
              recipeLinks.push(link);
            }
          }
          recipeLinks = recipeLinks.reverse();

          await this.$store.dispatch("SET_RECIPE_LINKS", recipeLinks);

        } catch (error) {
          console.log("Error: Failed setting recipes:", error.message);
        }
      }
    },
    makeBackupTitle(link) {
      let regex = /-/gi;
      let url = link.url;
      let title = url
        .split("/")
        .pop()
        .replace(regex, " ");
      return title;
    },
  }
};
