<template>
  <div class="recipe-link-wrap">
    <div
      class="recipe-link padding-horizontal--xlarge"
      :class="{ 'recipe-preview--no-link': editMode }"
    >
      <expand-transition :show="editMode" class="recipe-link__edit-form-wrap">
        <recipe-link-edit-form
          class="padding--large"
          :recipeLinkID="link && link[0]"
          :recipeLink="link && link[1]"
          :addingToCategory="addingToCategory"
          @update="update"
          @close-edit-mode="toggleEditMode"
        />
      </expand-transition>
      <div
        v-if="!editMode"
        class="padding-horizontal--xlarge"
        @click="event => openLink(event)"
      >
        <div class="recipe-link__settings">
          <settings-dropdown v-if="!editMode && link && link[0]">
            <span @click="event => toggleEditMode(event)">
              <edit-icon class="icon margin-right--medium" />
              Edit link
            </span>
            <span class="system-message" @click="event => toggleAlert(event)"
              ><delete-icon
                tabindex="0"
                class="icon margin-right--medium"
              />Delete link</span
            >
          </settings-dropdown>
        </div>
        <new-tab-icon class="recipe-link__new-tab-icon" />
        <h3
          class="recipe-preview__title margin-top--large margin-bottom--medium"
        >
          {{ link && link[1].title }}
        </h3>
        <div class="recipe-preview__description margin-bottom--large">
          {{ link && link[1].comment }}
        </div>
        <div v-if="labels" class="margin-bottom--xxlarge">
          <span
            class="recipe-preview__category"
            v-for="label in labels"
            :key="`label-${label}`"
            >{{ label }}</span
          >
        </div>
        <div class="recipe-link__published-by">
          {{ link && link[1].hostName }}
        </div>
      </div>
    </div>
    <Alert
      :alertMessage="
        `Are you sure you want to delete this link: '${link[1].title}'? `
      "
      :showAlert="showAlert"
      @confirmed="deleteLink"
      @cancel="toggleAlert"
    />
  </div>
</template>

<script>
import user from "~/mixins/user.js";
import RecipeLinkEditForm from "./RecipeLinkEditForm.vue";
import newTabIcon from "~/assets/graphics/icons/new-tab-icon.svg";
import ExpandTransition from "~/components/Transitions/Expand.vue";
import SettingsDropdown from "~/components/SettingsDropdown.vue";
import Alert from "~/components/Alert.vue";

export default {
  name: "recipe-link",
  components: {
    RecipeLinkEditForm,
    newTabIcon,
    SettingsDropdown,
    ExpandTransition,
    Alert
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
      editMode: false,
      showAlert: false
    };
  },
  mixins: [user],
  computed: {
    labels() {
      let labels = this.link && this.link[1].labels;
      return labels && labels.split(",");
    }
  },
  methods: {
    cancelEdit() {
      this.editMode = false;
      this.$emit("cancel");
    },
    toggleEditMode(event) {
      event && event.stopPropagation();
      this.editMode = !this.editMode;
    },
    update() {
      this.$emit("update");
      this.toggleEditMode();
    },
    toggleAlert(event) {
      event && event.stopPropagation();
      this.showAlert = !this.showAlert;
    },
    openLink(event) {
      event && event.stopPropagation();
      let url = this.link && this.link[1].url;
      if (url) window.open(url, "_blank");
    },
    deleteLink() {
      let linkID = this.link && this.link[0];
      if (linkID) {
        const recipeLinkRef = this.$fireDb
          .ref(`users/${this.user.id}/recipeLinks/${linkID}`)
          .remove()
          .then(res => {
            this.showAlert = false;
            this.update();
          })
          .catch(error => {
            this.submitSystemMessage = error.message;
            console.log("Error deleting recipe:", error.message);
          });
      } else {
        this.showAlert = false;
      }
    }
  },
  mounted() {
    if (this.link && !this.link[1].url) {
      this.editMode = true;
    }
  }
};
</script>
