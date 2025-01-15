import { defineStore } from "pinia";
import { getDatabase, ref, get, set, update } from "firebase/database";
import { useCurrentUser } from 'vuefire'

export const useShoppingListStore = defineStore("shoppingList", {
  state: () => ({
    count: 0
  }),
  actions: {
    SET_COUNT: async function() {
      const authUser = useCurrentUser();
      const db = getDatabase();
      
      try {
        const snapshot = await get(ref(db, "shoppingLists"));

        if(snapshot.exists()) {
          const shoppingLists = snapshot.val();
          let count = 0;

          for(let key in shoppingLists) {
            let shoppingList = shoppingLists[key];
            let owners = Object.values(shoppingList.owners);

            owners.forEach(owner => {
              if (owner.id === authUser.uid && shoppingList.subLists) {
                console.info("[SET_COUNT] Setting count");
                
                let subLists = shoppingList.subLists;
                for(let subKey in subLists) {
                  if(subLists[subKey].listItems) {
                    count += subLists[subKey].listItems.length;
                  }
                }
              }
            });
          }
          this.count = count;
        }
      } catch(error) {
        console.error("[SET_COUNT]", error.message)
      }
    }
  }
})