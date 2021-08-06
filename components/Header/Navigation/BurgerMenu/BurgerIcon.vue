<template>
  <div class="burger-icon">
    <span :class="'burger-icon_slice ' + (open ? 'burger-icon_slice--open' : '') " />
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
