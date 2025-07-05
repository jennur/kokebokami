<template>
  <div class="burger-icon">
    <span
      :class="'burger-icon_slice ' + (open ? 'burger-icon_slice--open' : '')"
    ></span>
  </div>
</template>

<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
});
</script>
