<template>
  <section class="prep-time-wrapper">
    <div v-if="(prepTime || isRecipeOwner) && !editPrepTime" class="prep-time">
      <b>{{ $t("recipes.preptime") }}:</b> {{ getTimeText(prepTime) }}
      <i-edit-icon
        tabindex="0"
        v-if="isRecipeOwner && !editPrepTime"
        @click="editPrepTime = true"
        class="icon margin-left-md"
      />
    </div>
    <prep-time-edit
      v-if="editPrepTime"
      :time="prepTime"
      @save-time="(time) => savePrepTime('prepTime', time)"
    />

    <div
      v-if="(cookingTime || isRecipeOwner) && !editCookingTime"
      class="prep-time"
    >
      <b>{{ $t("recipes.cookingTime") }}:</b> {{ getTimeText(cookingTime) }}
      <i-edit-icon
        tabindex="0"
        v-if="isRecipeOwner && !editCookingTime"
        @click="editCookingTime = true"
        class="icon margin-left-md"
      />
    </div>
    <prep-time-edit
      v-if="editCookingTime"
      :time="cookingTime"
      @save-time="(time) => savePrepTime('cookingTime', time)"
    />
    <div v-if="prepTime && cookingTime" class="prep-time">
      <fa
        :icon="['far', 'clock']"
        style="font-size: 15px; margin-right: 3px; cursor: pointer"
      />
      <b>{{ $t("recipes.totalTime") }}:</b> {{ totalTime }}
    </div>
  </section>
</template>

<script setup>
import { getDatabase, ref as dbRef, set } from "firebase/database";

import PrepTimeEdit from "./Editing/PrepTimeEdit";
import getTotalTime from "~/helpers/get-total-time.js";

const db = getDatabase();

const emit = defineEmits(["update"]);
const props = defineProps({
  prepTime: Object,
  cookingTime: Object,
  isRecipeOwner: Boolean,
  recipeKey: String,
});

const editPrepTime = ref(false);
const editCookingTime = ref(false);

const totalTime = computed(() => {
  let time = getTotalTime(props.prepTime, props.cookingTime);
  return getTimeText(time);
});

function getTimeText(time) {
  let text = "";
  if (time && time.h) text = `${time.h}h`;
  if (time && time.min) text += ` ${time.min}min`;

  return text;
}
function savePrepTime(path, time) {
  if (props.recipeKey) {
    set(dbRef(db, `recipes/${props.recipeKey}/${path}`), time)
      .then(() => {
        console.info(`[savePrepTime] Successfully updated ${path} time`);
        if (path === "prepTime") editPrepTime.value = false;
        if (path === "cookingTime") editCookingTime.value = false;
        emit("update");
      })
      .catch((error) =>
        console.error(`[savePrepTime] Error saving ${path}:`, error.message)
      );
  } else {
    const timeObj = {};
    timeObj[path] = time;
    if (path === "prepTime") editPrepTime.value = false;
    if (path === "cookingTime") editCookingTime.value = false;
    emit("update", { ...timeObj });
  }
}
</script>
