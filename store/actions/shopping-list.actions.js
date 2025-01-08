export const shoppingListActions = {

  SET_SHOPPING_LIST_COUNT: function({ commit }) {
    let authUser = this.$fire.auth.currentUser;
    this.$fire.database
      .ref("shoppingLists")
      .once("value", snapshot => {
        if(snapshot.exists()) {
          let shoppingLists = snapshot.val();
          let count = 0;

          for(let key in shoppingLists) {
            let shoppingList = shoppingLists[key];
            let owners = Object.values(shoppingList.owners);

            owners.forEach(owner => {
              if (owner.id === authUser.uid && shoppingList.subLists) {
                console.log("Setting count");
                let subLists = shoppingList.subLists;
                for(let subKey in subLists) {
                  if(subLists[subKey].listItems) {
                    count += subLists[subKey].listItems.length;
                  }
                }
              }
            });
          }
          commit("setShoppingListCount", count);
        }
      });
  }
};
