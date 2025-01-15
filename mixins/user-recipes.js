import { getDatabase, ref, get } from "firebase/database";
import { useCurrentUser } from 'vuefire'

import recipeModel from "../helpers/recipe-model";

export default {
  data() {
    return {
      currentUser: useCurrentUser(),
      userRecipes: [],
      errorMessage: "",
      loaded: false
    };
  },
  methods: {
    getUserRecipes() {
      if (this.currentUser) {
        try {
          const db = getDatabase();
          ref(db, "recipes")
          .once("value", async snapshot => {
            if (snapshot.exists()) {
              let userRecipes = [];
              let recipes = snapshot.val();
              for(let key in recipes){
                let recipe = recipes[key];

                if(recipe.ownerID === this.currentUser.uid) {
                  userRecipes.push(recipeModel(recipe, key))
                }
              }
              this.userRecipes = userRecipes.reverse();
            }
          })
          .then(() => {
            this.loaded = true;
          });
        } catch (error) {
          console.log("Error: Failed setting recipes:", error.message);
        }
      }
    }
  },
  created() {
    this.getUserRecipes();
  }
};
