export default {
  data() {
    return {
      allUsers,
      allUsersError
    };
  },
  mounted() {
    let componentThis = this;
    this.$fireDb.ref("users").once(
      "value",
      users => {
        users.forEach(user => {
          usersArray.push([user.key, user.val()]);
        });
        componentThis.allUsers = usersArray;
      },
      error => {
        console.log("Error while loading allUsers:", error);
        this.allUsersError =
          "Unable to load users. If the issue continues, please contact us.";
      }
    );
  }
};
