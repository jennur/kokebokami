<template>
  <div class="burger-icon">
    <span :class="'burger-icon__slice ' + (open ? 'burger-icon__slice--open' : '') " />
  </div>
</template>
<script>
export default {
  name: "burger-icon",
  props: {
    open: { type: Boolean, default: false }
  }
};
</script>
