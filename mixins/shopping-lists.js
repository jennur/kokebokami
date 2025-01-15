import { getDatabase, ref, get } from "firebase/database";

export default {
  data() {
    return {
      shoppingLists: [],
      loaded: false
    };
  },
  methods: {
    getShoppingLists() {
      let user = this.$store.user;

      if (user) {
        const db = getDatabase();
        let shoppingListRef = ref(db, `shoppingLists`);

        shoppingListRef
          .once("value", snapshot => {
            let userShoppingLists = [];

            if (snapshot.exists()) {
              let shoppingLists = snapshot.val();

              for(let key in shoppingLists) {
                let shoppingList = shoppingLists[key];
                let owners = Object.values(shoppingList.owners);

                owners.forEach(owner => {
                  if (owner.id === user.id) {
                    shoppingList.key = key;
                    userShoppingLists.push(shoppingList);
                  }
                });
              }
            }
            this.shoppingLists = userShoppingLists.reverse();
            this.loaded = true;
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
