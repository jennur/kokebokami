<template>
    <div class="favorite-icon" :class="{'selected': isUserFavorite}" title="Add to favorites" @click="event => handleFavorites(event)">
      <favorite-icon class="icon" />
      <span v-if="showCount" class="favorites-count">({{ favoritesCount || 0 }})</span>
    </div>
</template>

<script>
import favoriteIcon from "~/assets/graphics/icons/favorites-icon.svg";
import user from "~/mixins/user";

export default {
    name: "add-to-favorites",
    components: {
        favoriteIcon
    },
    props: {
        recipeKey: String,
        favoritesCount: Number,
        showCount: Boolean
    },
    mixins: [user],
    computed: {
        isUserFavorite() {
            if(this.user && this.user.id) {
                let favorites = this.$store.state.user.favorites;
                return favorites && Object.values(favorites).indexOf(this.recipeKey) > - 1;
            }
            return false;
        }
    },
    methods: {
        handleFavorites(event) {
            event && event.stopPropagation();

            if (this.user && this.user.id) {
                let favorites = this.$store.state.user.favorites;
                let isFavorite = false;
                for(let key in favorites) {
                if(this.recipeKey === favorites[key]){
                    isFavorite = true;
                    this.removeFromFavorites(key);
                }
                }
                if(!isFavorite) {
                this.saveToFavorites();
                }
            } else {
                this.$store.dispatch("SHOW_LOGIN_MODAL", {open: true, headline: "Login to add to your favorites!"});
            }
        },
        saveToFavorites() {
            this.$fire.database
                .ref(`users/${this.user.id}/favorites`)
                .push(this.recipeKey)
                .then(() => {
                this.$store.dispatch("UPDATE_USER_FAVORITES");
                console.log("Successfully added to favorites");

                this.$fire.database
                    .ref(`recipes/${this.recipeKey}/favoritesCount`)
                    .once("value", snapshot => {
                    let count = 1;
                    if(snapshot.exists()){
                        count = snapshot.val();
                        count += 1;
                    }
                    this.$fire.database
                        .ref(`recipes/${this.recipeKey}`)
                        .update({ favoritesCount: count });
                    })
                })
                .catch(error => console.log("Error saving to favorites:", error));
        },
        removeFromFavorites(key){
            this.$fire.database
                .ref(`users/${this.user.id}/favorites/${key}`)
                .remove()
                .then(() => {
                    this.$store.dispatch("UPDATE_USER_FAVORITES");
                    console.log("Successfully removed from favorites");

                    this.$fire.database
                        .ref(`recipes/${this.recipeKey}/favoritesCount`)
                        .once("value", snapshot => {
                        if(snapshot.exists()){
                            let count = snapshot.val();
                            count -= 1;

                            this.$fire.database
                            .ref(`recipes/${this.recipeKey}`)
                            .update({ favoritesCount: count });
                        }
                        })
                })
                .catch(error => console.log("Error removing from favorites:", error));
        }
    }
}
</script>
