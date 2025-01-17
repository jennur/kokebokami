import { defineStore } from "pinia";
import { getDatabase, ref, get, set, update } from "firebase/database";
import { getAuth } from "firebase/auth";

export const useShoppingListStore = defineStore("shoppingList", {
  state: () => ({
    count: 0,
    shoppingLists: [],
    loaded: true,
  }),
  actions: {
    SET_COUNT: function () {
      const auth = getAuth();
      let count = 0;
      this.shoppingLists.forEach(list => {
        Object.values(list.owners).forEach((owner) => {
          if (owner.id === auth.currentUser.uid && list.subLists) {
            console.info("[SET_COUNT] Setting count");
            
            const subLists = list.subLists;
            for (const subKey in subLists) {
              if (subLists[subKey].listItems) {
                count += subLists[subKey].listItems.length;
              }
            }
          }
        });

      });
      this.count = count;
    },
    REFRESH: function () {
      const auth = getAuth();
      this.loaded = false;

      if (auth.currentUser) {
        const db = getDatabase();
        get(ref(db, `shoppingLists`))
          .then((snapshot) => {
            const userShoppingLists = [];

            if (snapshot.exists()) {
              const shoppingLists = snapshot.val();

              for (const key in shoppingLists) {
                const shoppingList = shoppingLists[key];
                const owners = Object.values(shoppingList.owners);

                owners.forEach((owner) => {
                  if (owner.id === auth.currentUser.uid) {
                    shoppingList.key = key;
                    userShoppingLists.push(shoppingList);
                  }
                });
              }
              this.shoppingLists = userShoppingLists;
              console.log("SHOPPINGLISTS:", userShoppingLists);
              this.loaded = true;
              this.SET_COUNT();
            }
          })
          .catch((error) => {
            console.error("[REFRESH]", error.message);
            this.loaded = true;
          });
      }
    },
  },
});
