export default {
  data() {
    return {
      userAuth: this.$fire.auth.currentUser,
      shoppingLists: []
    };
  },
  methods: {
    getShoppingLists() {
      let componentThis = this;
      if (this.userAuth) {

        let userID = this.userAuth.uid;
        let username = this.$store.state.user.displayName;

        this.$fire.database
          .ref(`shoppingLists`)
          .once("value", shoppingLists => {
            let updatedShoppingLists = [];

            if (shoppingLists.exists()) {
              shoppingLists = Object.entries(shoppingLists.val()).reverse() || [];
              let shoppingListCount = 0;

              shoppingLists.forEach(list => {
                let owners = Object.values(list[1].owners);
                owners.forEach(user => {
                  if (user.id === userID) {
                    updatedShoppingLists.push(list);

                    if (list[1].subLists) {
                      let subLists = Object.values(list[1].subLists) || [];
                      subLists.forEach(subList => {
                        if (subList && subList.listItems) {
                          shoppingListCount += subList.listItems.length;
                        }
                      });
                    }
                  }
                });
              });

              componentThis.$store.dispatch(
                "SET_SHOPPING_LIST_COUNT",
                shoppingListCount
              );
            } else {
              shoppingListsRef
                .push({
                  title: "My shopping list",
                  createdBy: { id: userID, displayName: username },
                  owners: [{ id: userID, displayName: username }],
                  subLists: []
                })
                .then(() => {
                  shoppingListsRef.once("value", shoppingLists => {
                    updatedShoppingLists = Object.entries(shoppingLists.val());
                  });
                });
            }
            componentThis.shoppingLists = updatedShoppingLists;
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
