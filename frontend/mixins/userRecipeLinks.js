export default {
  data() {
    return {
      userAuth: this.$fire.auth.currentUser,
      userRecipeLinks: []
    };
  },
  methods: {
    getRecipeLinks() {
      let componentThis = this;
      if (this.userAuth) {
        try {
          let userRecipeLinksRef = this.$fire.database.ref(
            `users/${this.userAuth.uid}/recipeLinks`
          );
          userRecipeLinksRef.once("value", links => {
            if (links.exists()) {
              componentThis.userRecipeLinks = Object.entries(links.val());
            } else {
              componentThis.userRecipeLinks = [];
            }
          });
        } catch (error) {
          console.log("Error: Failed setting recipes:", error.message);
        }
      }
    }
  },
  mounted() {
    this.getRecipeLinks();
  }
};
