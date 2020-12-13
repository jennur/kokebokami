import userModel from "./user-model";

export default {
  data() {
    return {
      cook: null,
      loadedProfile: false
    };
  },
  mixins: [userModel],
  methods: {
    async getUserByID(userID) {
      let hiddenProfile = false;

      await this.$fire.database
        .ref(`users/${userID}/hiddenProfile`)
        .once("value", snapshot => {
          if (snapshot.exists()) {
            hiddenProfile = snapshot.val();
          }
        });

      if (!hiddenProfile) {
        let userPromises = [
          this.$fire.database.ref(`users/${userID}/displayName`).once("value"),
          this.$fire.database.ref(`users/${userID}/photoURL`).once("value"),
          this.$fire.database.ref(`users/${userID}/biography`).once("value")
        ];

        Promise.all(userPromises)
          .then((res) => {
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

            this.cook = user.displayName ? this.userModel(user, userID) : null; // displayName is never null for existing users
          })
          .then(() => {
            this.loadedProfile = true;
          })
          .catch(error => console.log("Error getting user data:", error));
      } else {
        this.cook = null;
        this.loadedProfile = true;
      }
    }
  }
};
