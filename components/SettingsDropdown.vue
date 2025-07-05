<template>
  <div class="settings-dropdown" :class="{ 'settings-dropdown--right': right }">
    <i-settings-icon
      tabindex="0"
      class="icon"
      @click="(event) => toggleDropdown(event)"
    />
    <transition name="pop-settings-dropdown">
      <div
        v-if="isOpen"
        class="settings-dropdown_dropdown"
        v-click-outside="closeDropdown"
      >
        <span class="pointer"></span>
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script setup>
const props = defineProps({
  right: {
    type: Boolean,
    default: false,
  },
});

const isOpen = ref(false);

function toggleDropdown(event) {
  event && event.stopPropagation();
  isOpen.value = !isOpen.value;
}

function closeDropdown() {
  isOpen.value = false;
}
</script>
