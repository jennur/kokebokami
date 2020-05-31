<template>
  <div class="tabs-wrap">
    <span class="tabs-mobile-helper margin-top--large"></span>
    <div ref="tabs" class="tabs margin-vertical--xlarge" v-click-outside="closeDropDown">
      <span
        class="tab tab--hide-mobile"
        v-for="(title, index) in tabTitles"
        :data-tab-index="index"
        :class="{'tab--active': activeTabIndex === index}"
        :key="`tab-${title}`"
        @click="(event) => switchTab(event,index)"
      >{{title}}</span>
    </div>
    <slot />
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";

export default {
  name: "Tabs",
  props: {
    tabTitles: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return { activeTabIndex: 0 };
  },
  methods: {
    closeDropDown() {
      let tabs = this.$refs.tabs;
      let tabElems = Object.values(tabs.getElementsByClassName("tab"));
      tabElems.forEach(tab => {
        if (!tab.classList.contains("tab--active-tab")) {
          tab.classList.add("tab--hide-mobile");
          tab.classList.remove("tab--dropdown-list");
        }
      });
    },
    switchTab(event, index) {
      this.activeTabIndex = index;
      let tabs = this.$refs.tabs;
      let tabElems = Object.values(tabs.getElementsByClassName("tab"));
      tabElems.forEach(tab => {
        if (tab.classList.contains("tab--hide-mobile")) {
          tab.classList.remove("tab--hide-mobile");
          tab.classList.add("tab--dropdown-list");
        } else if (tab !== event.target) {
          tab.classList.add("tab--hide-mobile");
        } else tab.classList.remove("tab--dropdown-list");
      });
      this.$emit("switchTab", index);
    }
  },
  directives: {
    ClickOutside
  }
};
</script>
