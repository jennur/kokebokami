<template>
  <div class="prep-time-edit-wrapper">
    <input type="number" min="0" class="hour" v-model="newTime.h" /><span
      >h</span
    >
    <input type="number" min="0" class="minutes" v-model="newTime.min" /><span
      >min</span
    >
    <button class="button button-xs margin-left-md" @click="handleSave">
      Save
    </button>
  </div>
</template>

<script setup>
const emit = defineEmits(["save-time"]);
const props = defineProps({
  time: Object,
});

const newTime = ref(
  props.time || {
    h: null,
    min: null,
  }
);

function handleSave() {
  emit("save-time", newTime.value);
}
</script>
