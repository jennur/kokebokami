export default {
  data() {
    return {
      userAuth: !!this.$fireAuth.currentUser,
      allUsers: [],
      errorMessage: ""
    };
  },
  methods: {
    getAllUsers() {
      console.log("Getting users");
      let componentThis = this;
      if (this.userAuth) {
        this.$fireDb.ref("users").once(
          "value",
          users => {
            if (users.exists()) {
              componentThis.allUsers = Object.entries(users.val());
            }
          },
          error => {
            console.log("Error while loading allUsers:", error);
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
