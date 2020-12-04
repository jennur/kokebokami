export default {
  data() {
    return {
      userAuth: !!this.$fire.auth.currentUser,
      allUsers: [],
      errorMessage: ""
    };
  },
  methods: {
    getAllUsers() {
      let componentThis = this;
      if (this.userAuth) {
        this.$fire.database.ref("users").once(
          "value",
          users => {
            if (users.exists()) {
              componentThis.allUsers = Object.entries(users.val())
                .filter(user => !user[1].hiddenProfile)
                .map(user => {
                  let userID = user[0];
                  user = user[1];
                  return [
                    userID,
                    {
                      displayName: user.displayName,
                      photoURL: user.photoURL,
                      biography: user.biography,
                      following: user.following,
                      hiddenProfile: user.hiddenProfile,
                      notificationsOff: user.notificationsOff
                    }
                  ];
                });
            }
          },
          error => {
            console.log("Error while loading allUsers:", error.message);
            this.errorMessage =
              "Unable to load users. If the issue continues, please contact us.";
          }
        );
      }
    }
  },
  mounted() {
    this.getAllUsers();
  }
};
