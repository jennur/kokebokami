<template>
  <div class="hover-info-box">
    <info-icon class="icon" @click="(event) => toggleBox(event)" />
    <div v-if="boxVisible" class="hover-box" v-click-outside="closeBox">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import infoIcon from "~/assets/graphics/icons/info-icon.svg";

const boxVisible = ref(false);

function toggleBox(event) {
  event && event.stopPropagation();
  boxVisible.value = !boxVisible.value;
}

function closeBox() {
  boxVisible.value = false;
}
</script>
