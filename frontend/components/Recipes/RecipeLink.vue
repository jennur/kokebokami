<template>
  <div class="recipe-link-display-wrap margin-top--large">
    <button
      class="button button--dynamic button--dynamic-small margin-bottom--medium"
      :class="{
              'button--cancel': editMode,
            'button--transparent margin-left--medium': !editMode
            }"
      @click="toggleEditMode"
    >{{editMode ? "✕ Close" : "Edit"}}</button>
    <div
      class="recipe-link-display recipe-display--left-aligned padding-horizontal--xlarge"
      :class="{'recipe-display--no-link': editMode}"
    >
      <expand-transition :show="editMode">
        <recipe-link-edit-form
          class="padding-horizontal--xlarge"
          :recipeLinkID="link && link[0]"
          :recipeLink="link && link[1]"
          :addingToCategory="addingToCategory"
          @closeEditMode="toggleEditMode"
        />
      </expand-transition>
      <a
        v-if="!editMode"
        class="padding-horizontal--xlarge"
        :href="link && link[1].url"
        target="_blank"
        title="Opens in new tab"
      >
        <new-tab-icon class="recipe-display__new-tab-icon" />
        <h3 class="recipe-display__title margin-bottom--medium">{{link && link[1].title}}</h3>
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
  </div>
</template>

<script>
import RecipeLinkEditForm from "./RecipeLinkEditForm.vue";
import newTabIcon from "~/assets/graphics/icons/new-tab-icon.svg";
import ExpandTransition from "~/components/Transitions/Expand.vue";

export default {
  name: "recipe-link",
  components: {
    RecipeLinkEditForm,
    newTabIcon,
    ExpandTransition
  },
  props: {
    link: {
      type: Array,
      default: () => []
    },
    addingToCategory: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      editMode: false
    };
  },
  computed: {
    labels() {
      let labels = this.link && this.link[1].labels;
      return labels && labels.split(",");
    }
  },
  methods: {
    toggleEditMode() {
      this.$emit("update");
      this.editMode = !this.editMode;
    }
  },
  mounted() {
    if (this.link && !this.link[1].url) {
      this.editMode = true;
    }
  }
};
</script>
