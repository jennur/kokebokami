import { getDatabase, ref, get } from "firebase/database";
import recipeModel from "~/helpers/recipe-model";
import { useCurrentUser } from 'vuefire'

export default {
  data(){
    return {
      favoriteRecipes: []
    }
  },
  methods: {
    getUserFavorites(){
      let currentUser = useCurrentUser();
      if(currentUser && currentUser.uid) {
        const db = getDatabase();
          get(ref(db, `users/${currentUser.uid}/favorites`), snapshot => {
            if(snapshot.exists()){
              let keys = Object.values(snapshot.val());

              keys && keys.forEach(key => {
                const db = getDatabase();
                get(ref(db, `recipes/${key}`), snapshot => {
                    if(snapshot.exists()){
                      let recipe = snapshot.val();
                      this.favoriteRecipes.push(recipeModel(recipe, key))
                    }
                  })
                  .catch(error => console.log("Error getting recipe:", error));
              })
            }
          })
          .catch(error => console.log("Error getting favorites:", error));
      }
    }
  },
  mounted(){
    this.getUserFavorites();
  }
}
