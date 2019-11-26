<template>
  <div class="flex-row following-cooks">
    <cook-display
      v-for="cook in cooks"
      :key="cook[0]"
      :cookID="cook[0]"
      :photoURL="cook[1].photoURL"
      :displayName="cook[1].displayName"
      :biography="cook[1].biography"
    />
  </div>
</template>
<script>
import CookDisplay from "./CookDisplay.vue";
export default {
  name: "cooks-list",
  components: {
    CookDisplay
  },
  props: {
    cooks: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    cooksLength() {
      return this.cooks ? this.cooks.length : 0;
    }
  }
};
</script>
