<template>
  <div class="servings">
    <input type="number" min="0" step="1" v-model="updatedServings" /><button
      class="button button--dynamic-small button--round padding-v-sm margin-h-lg"
      @click="handleClick"
    >
      Save
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  servings: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["save"]);
const updatedServings = ref(props.servings);

function handleClick(event) {
  event.even.stopPropagation();
  emit("save", updatedServings.value);
}
</script>
