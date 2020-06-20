export default {
  data() {
    return {
      userAuth: this.$fireAuth.currentUser,
      shoppingLists: []
    };
  },
  methods: {
    getShoppingLists() {
      let componentThis = this;
      if (this.userAuth) {
        let shoppingListsRef = this.$fireDb.ref(
          `users/${this.userAuth.uid}/shoppingLists`
        );
        shoppingListsRef
          .once("value", shoppingLists => {
            console.log("Getting shoppingLists", shoppingLists.val());

            if (shoppingLists.exists()) {
              componentThis.shoppingLists = Object.entries(shoppingLists.val());
            } else {
              shoppingListsRef.push({ title: "My shopping list" }).then(() => {
                shoppingListsRef.once("value", shoppingLists => {
                  componentThis.shoppingLists = Object.entries(
                    shoppingLists.val()
                  );
                });
              });
            }
          })
          .then(() => {
            console.log(
              "ShoppingLists after get:",
              componentThis.shoppingLists
            );
          })
          .catch(error => {
            console.log("Error: Failed getting shopping list:", error.message);
          });
      }
    }
  },
  mounted() {
    this.getShoppingLists();
  }
};
