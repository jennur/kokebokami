<template>
  <div class="recipe-link-wrap">
    <div
      class="recipe-link padding-horizontal-xl"
      :class="{ 'recipe-link--no-link': editMode }"
    >
      <expand-transition :show="editMode" class="recipe-link_edit-form-wrap">
        <recipe-link-edit-form
          class="padding-lg"
          :recipeLinkID="link && link.id"
          :recipeLink="link"
          :addingToCategory="addingToCategory"
          @update="update"
          @close-edit-mode="cancelEdit"
        />
      </expand-transition>
      <div
        v-if="!editMode"
        class="padding-horizontal-xl"
        @click="event => openLink(event)"
      >
        <div class="recipe-link_settings">
          <settings-dropdown v-if="!editMode && link && link.id">
            <span @click="event => toggleEditMode(event)">
              <edit-icon class="icon margin-right-md" />
              Edit link
            </span>
            <span class="system-message" @click="event => toggleAlert(event)"
              ><delete-icon
                tabindex="0"
                class="icon margin-right-md"
              />Delete link</span
            >
          </settings-dropdown>
        </div>
        <new-tab-icon class="recipe-link_new-tab-icon" />
        <h3
          class="recipe-link_title margin-top-lg margin-bottom-md"
        >
          {{ link && link.title }}
        </h3>
        <div class="recipe-link_description margin-bottom-lg">
          {{ link && link.comment }}
        </div>
        <div v-if="labels" class="margin-bottom-2xl">
          <span
            class="recipe-link_category"
            v-for="label in labels"
            :key="`label-${label}`"
            >{{ label }}</span
          >
        </div>
        <div class="recipe-link_published-by">
          {{ link && link.hostName }}
        </div>
      </div>
    </div>
    <Alert
      :alertMessage="
        `Are you sure you want to delete this link: '${link.title}'? `
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
import newTabIcon from "assets/graphics/icons/new-tab-icon.svg";
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
      type: Object,
      default: () => {}
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
      let labels = this.link && this.link.labels;
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
      let url = this.link && this.link.url;
      if (url) window.open(url, "_blank");
    },
    deleteLink() {
      let linkID = this.link && this.link.id;
      if (linkID && this.user && this.user.id) {
        this.$fire.database
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
      }
    }
  },
  mounted() {
    if (this.link && !this.link.url) {
      this.editMode = true;
    }
  }
};
</script>
