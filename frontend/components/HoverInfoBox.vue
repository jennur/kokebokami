<template>
  <div class="hover-info-box">
    <info-icon class="icon" @click="event => toggleBox(event)" />
    <div v-if="boxVisible" class="hover-box" v-click-outside="closeBox">
      <slot />
    </div>
  </div>
</template>

<script>
import infoIcon from "~/assets/graphics/icons/info-icon.svg";
import ClickOutside from "vue-click-outside";

export default {
  name: "hover-info-box",
  components: {
    infoIcon,
  },
  data() {
    return {
      boxVisible: false,
    };
  },
  methods: {
    toggleBox(event) {
      event && event.stopPropagation();
      this.boxVisible = !this.boxVisible;
    },
    closeBox() {
      this.boxVisible = false;
    },
  },
  directives: {
    ClickOutside,
  },
};
</script>
