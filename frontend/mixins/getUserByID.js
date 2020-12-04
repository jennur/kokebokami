export default {
  data() {
    return {
      cook: null,
      loadedProfile: false
    };
  },
  methods: {
    async getUserByID(userID) {
      let componentThis = this;
      let hiddenProfile = false;

      await componentThis.$fire.database
        .ref(`users/${userID}/hiddenProfile`)
        .once("value", hiddenStatus => {
          if (hiddenStatus.exists()) {
            hiddenProfile = hiddenStatus.val();
          }
        });

      if (!hiddenProfile) {
        let userPromises = [
          this.$fire.database.ref(`users/${userID}/displayName`).once("value"),
          this.$fire.database.ref(`users/${userID}/photoURL`).once("value"),
          this.$fire.database.ref(`users/${userID}/biography`).once("value")
        ];

        Promise.all(userPromises)
          .then(function(res) {
            let user = { id: userID };

            if (res[0].exists()) {
              user.displayName = res[0].val();
            }
            if (res[1].exists()) {
              user.photoURL = res[1].val();
            }
            if (res[2].exists()) {
              user.biography = res[2].val();
            }
            componentThis.cook = user.displayName ? user : null; // displayName is never null for existing users
          })
          .then(() => {
            componentThis.loadedProfile = true;
          })
          .catch(error => console.log("Error getting user data:", error));
      } else {
        this.cook = null;
        this.loadedProfile = true;
      }
    }
  }
};
