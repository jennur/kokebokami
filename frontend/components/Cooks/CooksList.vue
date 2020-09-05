<template>
  <section>
    <div class="flex-row following-cooks margin-bottom--xxlarge">
      <cook-display
        v-for="cook in cooks"
        :key="cook[0]"
        :cookID="cook[0]"
        :photoURL="cook[1].hiddenProfile ? '' : cook[1].photoURL"
        :displayName="cook[1].hiddenProfile ? 'User' : cook[1].displayName"
        :biography="cook[1].hiddenProfile ? '' : cook[1].biography"
      />
    </div>
    <div v-if="!cooksLength" class="container container--center">
      <p class="margin--auto margin-bottom--xlarge mobile-width">{{emptyListMessage}}</p>
    </div>
  </section>
</template>
<script>
import CookDisplay from "./CookDisplay.vue";
export default {
  name: "cooks-list",
  components: {
    CookDisplay,
  },
  props: {
    cooks: {
      type: Array,
      default: () => [],
    },
    emptyListMessage: {
      type: String,
      default: "",
    },
  },
  computed: {
    cooksLength() {
      return this.cooks ? this.cooks.length : 0;
    },
  },
};
</script>
