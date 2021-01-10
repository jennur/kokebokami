import recipeModel from "~/helpers/recipe-model";

export default {
  data(){
    return {
      favoriteRecipes: []
    }
  },
  methods: {
    getUserFavorites(){
      let currentUser = this.$fire.auth.currentUser;
      if(currentUser && currentUser.uid) {
        this.$fire.database
          .ref(`users/${currentUser.uid}/favorites`)
          .once("value", snapshot => {
            if(snapshot.exists()){
              let keys = Object.values(snapshot.val());

              keys && keys.forEach(key => {
                this.$fire.database
                  .ref(`recipes/${key}`)
                  .once("value", snapshot => {
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
