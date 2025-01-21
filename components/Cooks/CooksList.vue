<template>
  <section>
    <div class="flex-row following-cooks margin-bottom-2xl">
      <CookDisplay
        v-for="cook in cooks"
        :key="cook.id"
        :cook="cook"
        :photoURL="cook.hiddenProfile ? '' : cook.photoURL"
        :displayName="cook.hiddenProfile ? 'User' : cook.displayName"
        :biography="cook.hiddenProfile ? '' : cook.biography"
      />
    </div>
    <div v-if="!cooksLength" class="container container--center">
      <p class="margin-auto margin-bottom-xl mobile-width">
        {{ emptyListMessage }}
      </p>
    </div>
  </section>
</template>
<script setup>
import CookDisplay from "./CookDisplay.vue";

const props = defineProps({
  cooks: {
    type: Array,
    default: () => [],
  },
  emptyListMessage: {
    type: String,
    default: "",
  },
});

const cooksLength = computed(() => {
  return props.cooks?.length || 0;
});
</script>
