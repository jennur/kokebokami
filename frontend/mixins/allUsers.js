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
