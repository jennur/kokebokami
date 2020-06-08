<template>
  <div
    class="recipe-display recipe-display--left-aligned"
    :class="{'recipe-display--no-link': editMode}"
  >
    <recipe-link-edit-form
      class="padding-horizontal--xlarge"
      v-if="editMode"
      :recipeLinkID="link && link[0]"
      :recipeLink="link && link[1]"
    />
    <a
      v-else
      class="padding-horizontal--xlarge"
      :href="link && link[1].url"
      target="_blank"
      title="Opens in new tab"
    >
      <new-tab-icon class="recipe-display__new-tab-icon" />
      <h3
        class="recipe-display__title margin-bottom--medium"
      >{{link && link[1].title || backupTitle}}</h3>
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
  </div>
</template>
<script>
import RecipeLinkEditForm from "./RecipeLinkEditForm.vue";
import newTabIcon from "~/assets/graphics/new-tab-icon.svg";

export default {
  name: "recipe-link",
  components: {
    RecipeLinkEditForm,
    newTabIcon
  },
  props: {
    link: {
      type: Array,
      default: () => []
    },
    editMode: {
      type: Boolean,
      default: false
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
