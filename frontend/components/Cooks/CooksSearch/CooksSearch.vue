<template>
  <div v-click-outside="closeDropdown" class="cooks__search margin--auto">
    <label>
      <userIcon class="cooks__user-icon" />
      <input
        type="text"
        placeholder="Search for username"
        v-model="searchTerm"
      />
    </label>
    <cooks-dropdown v-if="searchTerm" :searchTerm="searchTerm" />
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
import CooksDropdown from "./CooksDropdown.vue";
import userIcon from "~/assets/graphics/cook-silhouette.svg";

export default {
  name: "cooks-search",
  components: {
    CooksDropdown,
    userIcon
  },
  data() {
    return { searchTerm: "", open: true };
  },
  methods: {
    closeDropdown() {
      this.searchTerm = "";
    }
  },
  directives: {
    ClickOutside
  }
};
</script>
