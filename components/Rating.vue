<template>
  <span class="rating-wrapper">
    <fa
      v-for="index in totalRating"
      :key="`star-${index}`"
      :data-star="`star-${index}`"
      tabindex="0"
      :icon="['fas', 'star']"
      style="font-size: 15px; margin-right: 5px; cursor: pointer"
      @click="!deactivated && setRating(index)"
      @keydown="
        (event) => event.keyCode === 13 && !deactivated && setRating(index)
      "
    />
    <fa
      v-for="index in 5 - totalRating"
      :key="`star-${index + totalRating}`"
      :data-star="`star-${index + totalRating}`"
      tabindex="0"
      :icon="['far', 'star']"
      style="font-size: 15px; margin-right: 5px; cursor: pointer"
      @click="!deactivated && setRating(index + totalRating)"
      @keydown="
        (event) =>
          event.keyCode === 13 && !deactivated && setRating(index + totalRating)
      "
    />
    <span v-if="showTotalVotes" class="total-votes"> ({{ totalVoted }})</span>
  </span>
</template>

<script setup>
import { getDatabase, ref as dbRef, get, set } from "firebase/database";

const props = defineProps({
  rating: {
    type: Array,
    default: () => [],
  },
  recipeKey: {
    type: String,
    default: "",
  },
  showTotalVotes: {
    type: Boolean,
    default: true,
  },
  deactivated: {
    type: Boolean,
    default: false,
  },
});

const currentRating = ref(props.rating || []);

const totalRating = computed(() => {
  if (currentRating.value.length) {
    let rateCount = currentRating.value.reduce((a, b) => a + b, 0);
    return (
      (rateCount && Math.round(rateCount / currentRating.value.length)) || 0
    );
  }
  return 0;
});
const totalVoted = computed(() => {
  return currentRating.value.length;
});

function setRating(rate) {
  if (props.recipeKey) {
    let newRating = [rate];
    const db = getDatabase();
    const ratingRef = dbRef(db, `recipes/${props.recipeKey}/rating`);

    get(ratingRef)
      .then((snapshot) => {
        if (snapshot.val()) {
          const rating = snapshot.val();
          newRating = rating.concat([rate]);
        }

        set(ratingRef, newRating)
          .then(() => {
            currentRating.value.push(rate);
            console.info(`[setRating] Rated ${rate} stars`);
          })
          .catch((error) => console.error("[setRating]", error.message));
      })
      .catch((error) => console.error("[setRating]", error.message));
  }
}
</script>
