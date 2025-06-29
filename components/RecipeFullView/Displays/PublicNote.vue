<template>
  <span @click="togglePublic" :key="updated">
    {{ isPublic ? $t("recipes.makePrivate") : $t("recipes.makePublic") }}
  </span>
</template>
<script setup>
import { getDatabase, ref as dbRef, set } from "firebase/database";
const db = getDatabase();

const emit = defineEmits(["update"]);

const props = defineProps({
  isPublic: {
    type: Boolean,
    default: false,
  },
  recipeKey: {
    type: String,
    default: "",
  },
});

const updated = ref(1);

function togglePublic() {
  const isPublic = !props.isPublic;
  const recipeKey = props.recipeKey;

  if (recipeKey) {
    set(dbRef(db, `recipes/${recipeKey}/public`), isPublic)
      .then(() => {
        console.info("[togglePublic] Successfully updated public status");
        emit("update");
        updated.value++;
      })
      .catch((error) =>
        console.error("[togglePublic]", error.message)
      );
  } else {
    emit("update", { public: isPublic });
    updated.value++;
  }
}
</script>
