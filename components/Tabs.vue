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
        <down-arrow class="icon icon-sm" />
      </span>
      <div v-if="!isTablet || dropdownOpen" class="dropdown">
        <span
          class="tab"
          v-for="(title, index) in tabTitles"
          :data-tab-index="index"
          :class="{ 'tab--active': activeTabIndex === index }"
          :key="`tab-${title}`"
          @click="event => switchTab(event, index)"
          >{{ title }}</span
        >
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
 

export default {
  name: "Tabs",
  props: {
    tabTitles: {
      type: Array,
      default: () => []
    },
    activeTabIndexControl: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      activeTabIndex: this.activeTabIndexControl || 0,
      dropdownOpen: false
    };
  },
  computed: {
    isTablet() {
      let width = window?.innerWidth > 0 ? window?.innerWidth : screen.width;
      return width < 800;
    },
    activeTitle() {
      let titles = this.tabTitles;
      return titles[this.activeTabIndex];
    }
  },
  methods: {
    openDropdown() {
      this.dropdownOpen = true;
    },
    closeDropdown() {
      this.dropdownOpen = false;
    },
    switchTab(event, index) {
      this.activeTabIndex = index;
      this.closeDropdown();
      this.$emit("switchTab", index);
    }
  },
  
};
</script>
