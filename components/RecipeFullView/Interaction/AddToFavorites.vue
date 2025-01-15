<template>
  <div class="favorite-icon" :class="{'selected': isUserFavorite}" title="Add to favorites" @click="event => handleFavorites(event)">
  <favorite-icon class="icon" />
  <span v-if="showCount" class="favorites-count">({{ favoritesCount || 0 }})</span>
  </div>
</template>

<script setup>
import { getDatabase, ref, get } from "firebase/database";
import favoriteIcon from "~/assets/graphics/icons/favorites-icon.svg";
import useUser from "~/composables/user";

const { $store } = useNuxtApp();

const props = defineProps({
  recipeKey: {
    type: String,
    default: ""
  },
  favoritesCount: {
    type: Number,
    default: 0
  },
  showCount: {
    type: Boolean,
    default: false
  }
})
const user = computed(() => useUser());

const isUserFavorite = computed(() => {
  if(user.value && user.value.id) {
      const favorites = $store.user.favorites;
      return favorites && Object.values(favorites).indexOf(props.recipeKey) > - 1;
  }
  return false;
})

function handleFavorites(event) {
  event && event.stopPropagation();

  if (user.value && user.value.id) {
      let favorites = $store.user.favorites;
      let isFavorite = false;
      for(let key in favorites) {
      if(props.recipeKey === favorites[key]){
          isFavorite = true;
          removeFromFavorites(key);
      }
      }
      if(!isFavorite) {
      saveToFavorites();
      }
  } else {
      $store.SHOW_LOGIN_MODAL({open: true, headline: "Login to add to your favorites!"});
  }
}

function saveToFavorites() {
  const db = getDatabase();
      ref(db, `users/${user.value.id}/favorites`)
      .push(props.recipeKey)
      .then(() => {
      $store.UPDATE_USER_FAVORITES();
      console.log("Successfully added to favorites");

      const db = getDatabase();
      get(ref(db, `recipes/${props.recipeKey}/favoritesCount`), snapshot => {
        let count = 1;
        if(snapshot.exists()){
            count = snapshot.val();
            count += 1;
        }
        const db = getDatabase();
        ref(db, `recipes/${props.recipeKey}`)
        .update({ favoritesCount: count });
        })
      })
      .catch(error => console.log("Error saving to favorites:", error));
}

function removeFromFavorites(key){
  const db = getDatabase();
      ref(db, `users/${user.value.id}/favorites/${key}`)
      .remove()
      .then(() => {
          $store.UPDATE_USER_FAVORITES();
          console.log("Successfully removed from favorites");

          const db = getDatabase();
          get(ref(db, `recipes/${props.recipeKey}/favoritesCount`), snapshot => {
            if(snapshot.exists()){
              let count = snapshot.val();
              count -= 1;

              const db = getDatabase();
              ref(db, `recipes/${props.recipeKey}`)
              .update({ favoritesCount: count });
            }
          })
      })
      .catch(error => console.log("Error removing from favorites:", error));
}
</script>
