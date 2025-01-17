<template>
  <div
    class="favorite-icon"
    :class="{ selected: isUserFavorite }"
    title="Add to favorites"
    @click="(event) => handleFavorites(event)"
  >
    <FavoriteIcon class="icon" />
    <span v-if="showCount" class="favorites-count"
      >({{ favoritesCount || 0 }})</span
    >
  </div>
</template>

<script setup>
import { getDatabase, ref, get } from "firebase/database";
import FavoriteIcon from "~/assets/graphics/icons/favorites-icon.svg";
import { useMainStore, useAuthStore } from "~/store";

const db = getDatabase();
const mainStore = useMainStore();
const authStore = useAuthStore();

const props = defineProps({
  recipeKey: {
    type: String,
    default: "",
  },
  favoritesCount: {
    type: Number,
    default: 0,
  },
  showCount: {
    type: Boolean,
    default: false,
  },
});

const isUserFavorite = computed(() => {
  if (authStore?.user?.id) {
    const favorites = authStore.user.favorites;
    return favorites && Object.values(favorites).some(key => key === props.recipeKey);
  }
  return false;
});

function handleFavorites(event) {
  event && event.stopPropagation();

  if (authStore.user && authStore.user.id) {
    const favorites = authStore.user.favorites;
    let isFavorite = false;

    for (const key in favorites) {
      if (props.recipeKey === favorites[key]) {
        isFavorite = true;
        removeFromFavorites(key);
      }
    }
    if (!isFavorite) {
      saveToFavorites();
    }
  } else {
    mainStore.SHOW_LOGIN_MODAL({
      open: true,
      headline: "Login to add to your favorites!",
    });
  }
}

function saveToFavorites() {
  push(ref(db, `users/${authStore.user.id}/favorites`), props.recipeKey)
    .then(() => {
      authStore.UPDATE_USER_FAVORITES();
      console.info("[saveToFavorites] Successfully added to favorites");

      get(ref(db, `recipes/${props.recipeKey}/favoritesCount`)).then(
        (snapshot) => {
          let count = 1;
          if (snapshot.exists()) {
            count = snapshot.val() + 1;
          }

          update(ref(db, `recipes/${props.recipeKey}`), {
            favoritesCount: count,
          });
        }
      );
    })
    .catch((error) => console.error("[saveToFavorites]", error.message));
}

function removeFromFavorites(key) {
  remove(ref(db, `users/${authStore.user.id}/favorites/${key}`))
    .then(() => {
      authStore.UPDATE_USER_FAVORITES();
      console.info("[removeFromFavorites] Successfully removed from favorites");

      get(ref(db, `recipes/${props.recipeKey}/favoritesCount`)).then(
        (snapshot) => {
          if (snapshot.exists()) {
            const count = snapshot.val() - 1;

            update(ref(db, `recipes/${props.recipeKey}`), {
              favoritesCount: count,
            });
          }
        }
      );
    })
    .catch((error) => console.error("[removeFromFavorites]", error.message));
}
</script>
