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
            if (shoppingLists.exists()) {
              shoppingLists = Object.entries(shoppingLists.val());
              componentThis.shoppingLists = shoppingLists;
              let shoppingListCount = 0;
              shoppingLists.forEach(list => {
                if (list && list[1] && list[1].subLists) {
                  let subLists = Object.entries(list[1].subLists) || [];
                  subLists.forEach(subList => {
                    if (subList && subList[1] && subList[1].listItems) {
                      shoppingListCount += subList[1].listItems.length;
                    }
                  });
                }
              });
              componentThis.$store.dispatch(
                "SET_SHOPPING_LIST_COUNT",
                shoppingListCount
              );
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
