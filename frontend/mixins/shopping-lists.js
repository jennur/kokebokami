export default {
  data() {
    return {
      userAuth: this.$fire.auth.currentUser,
      shoppingLists: []
    };
  },
  methods: {
    getShoppingLists() {
      if (this.userAuth) {

        let authID = this.userAuth.uid;
        let username = this.$store.state.user.displayName;
        let shoppingListRef = this.$fire.database.ref(`shoppingLists`);

        shoppingListRef
          .once("value", snapshot => {
            let userShoppingLists = [];

            if (snapshot.exists()) {
              let shoppingLists = Object.entries(snapshot.val()).reverse() || [];
              let shoppingListCount = 0;

              shoppingLists.forEach(list => {
                let owners = Object.values(list[1].owners);
                owners.forEach(user => {

                  if (user.id === authID) {
                    userShoppingLists.push(list);

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

              this.$store.dispatch("SET_SHOPPING_LIST_COUNT", shoppingListCount);
            } else {
              shoppingListsRef
                .push({
                  title: "My shopping list",
                  createdBy: { id: authID, displayName: username },
                  owners: [{ id: authID, displayName: username }],
                  subLists: []
                })
                .then(() => {
                  shoppingListsRef.once("value", shoppingLists => {
                    userShoppingLists = Object.entries(shoppingLists.val());
                  });
                });
            }
            this.shoppingLists = userShoppingLists;
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
