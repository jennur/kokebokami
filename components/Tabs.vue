<template>
  <div class="tabs-wrap">
    <div
      ref="tabs"
      :class="{ tabs: !isTablet, 'tabs-select': isTablet }"
      v-click-outside="closeDropdown"
      @click="openDropdown"
    >
      <span class="active-tab" v-if="isTablet">
        {{ activeTitle }}
        <DownArrow class="icon icon-sm" />
      </span>
      <div v-if="!isTablet || dropdownOpen" class="dropdown">
        <span
          class="tab"
          v-for="(title, index) in tabTitles"
          :data-tab-index="index"
          :class="{ 'tab--active': activeTabIndex === index }"
          :key="`tab-${title}`"
          @click="(event) => switchTab(event, index)"
          >{{ title }}</span
        >
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import DownArrow from "assets/graphics/icons/down-arrow.svg";

const emit = defineEmits(["switchTab"]);

const props = defineProps({
  tabTitles: {
    type: Array,
    default: () => [],
  },
  activeTabIndexControl: {
    type: Number,
    default: null,
  },
});

const activeTabIndex = ref(props.activeTabIndexControl || 0);
const dropdownOpen = ref(false);

const isTablet = computed(() => {
  let width = window?.innerWidth > 0 ? window?.innerWidth : screen.width;
  return width < 800;
});
const activeTitle = computed(() => {
  let titles = this.tabTitles;
  return titles[this.activeTabIndex];
});

function openDropdown() {
  dropdownOpen.value = true;
}

function closeDropdown() {
  dropdownOpen.value = false;
}

function switchTab(event, index) {
  activeTabIndex.value = index;
  closeDropdown();
  emit("switchTab", index);
}
</script>
