<template>
  <a
    class="recipe-display recipe-display--left-aligned padding-horizontal--xlarge"
    :href="link && link[1].url"
    target="_blank"
    title="Opens in new tab"
  >
    <new-tab-icon class="recipe-display__new-tab-icon" />
    <h3 class="recipe-display__title margin-bottom--medium">{{link && link[1].title || backupTitle}}</h3>
    <div class="recipe-display__description margin-bottom--large">{{link && link[1].comment}}</div>
    <div v-if="labels">
      <span
        class="recipe-display__category margin-right--small margin-bottom--xlarge"
        v-for="label in labels"
        :key="`label-${label}`"
      >{{label}}</span>
    </div>
    <div class="recipe-display__published-by">{{link && link[1].hostName}}</div>
  </a>
</template>
<script>
import newTabIcon from "~/assets/graphics/new-tab-icon.svg";
export default {
  name: "recipe-link",
  components: {
    newTabIcon
  },
  props: {
    link: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    labels() {
      let labels = this.link && this.link[1].labels;
      return labels && labels.split(",");
    },
    backupTitle() {
      let regex = /-/gi;
      let url = this.link[1].url;
      let title = url
        .split("/")
        .pop()
        .replace(regex, " ");
      return title;
    }
  }
};
</script>
