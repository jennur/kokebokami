export default {
  data() {
    return {
      currentUser: this.$fire.auth.currentUser,
      recipeLinks: []
    };
  },
  methods: {
    getRecipeLinks() {
      if (this.currentUser) {
        try {
          this.$fire.database
          .ref(`users/${this.currentUser.uid}/recipeLinks`)
          .once("value", snapshot => {
            let recipeLinks = [];
            if (snapshot.exists()) {
              let links = snapshot.val();

              for(let key in links){
                let link = links[key];
                link.id = key;
                link.title = link.title || this.makeBackupTitle(link);
                recipeLinks.push(link);
              }
            }
            this.recipeLinks = recipeLinks.reverse();
          });
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
