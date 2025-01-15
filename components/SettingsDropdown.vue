<template>
  <div class="settings-dropdown" :class="{ 'settings-dropdown--right': right }">
    <settings-icon
      tabindex="0"
      class="icon"
      @click="event => toggleDropdown(event)"
    />
    <transition name="pop-settings-dropdown">
      <div
        v-if="open"
        class="settings-dropdown_dropdown"
        v-click-outside="closeDropdown"
      >
        <span class="pointer"></span>
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
 
export default {
  name: "settings-dropdown",
  props: {
    right: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      open: false
    };
  },
  methods: {
    toggleDropdown(event) {
      event && event.stopPropagation();
      this.open = !this.open;
    },
    closeDropdown() {
      this.open = false;
    }
  },
  
};
</script>
