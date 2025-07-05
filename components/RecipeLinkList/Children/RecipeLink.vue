<template>
  <div class="recipe-link-wrap">
    <div
      :class="['recipe-link padding-h-xl', editMode && 'recipe-link--no-link']"
    >
      <ExpandTransition :show="editMode" class="recipe-link_edit-form-wrap">
        <RecipeLinkEditForm
          class="padding-lg"
          :recipeLinkID="link?.id"
          :recipeLink="link"
          :addingToCategory="addingToCategory"
          @update="updateLink"
          @close-edit-mode="cancelEdit"
        />
      </ExpandTransition>
      <div
        v-if="!editMode"
        class="padding-h-xl"
        @click="(event) => openLink(event)"
      >
        <div class="recipe-link_settings">
          <SettingsDropdown v-if="!editMode && link?.id">
            <span @click="(event) => toggleEditMode(event)">
              <i-edit-icon class="icon margin-right-md" />
              Edit link
            </span>
            <span class="system-message" @click="(event) => toggleAlert(event)"
              ><i-delete-icon tabindex="0" class="icon margin-right-md" />Delete
              link</span
            >
          </SettingsDropdown>
        </div>
        <new-tab-icon class="recipe-link_new-tab-icon" />
        <h3 class="recipe-link_title margin-top-lg margin-bottom-md">
          {{ link?.title }}
        </h3>
        <div class="recipe-link_description margin-bottom-lg">
          {{ link?.comment }}
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
          {{ link?.hostName }}
        </div>
      </div>
    </div>
    <Alert
      :alertMessage="`Are you sure you want to delete this link: '${link?.title}'? `"
      :showAlert="showAlert"
      @confirmed="deleteLink"
      @cancel="toggleAlert"
    />
  </div>
</template>

<script setup>
import { getDatabase, ref as dbRef, get, remove } from "firebase/database";
import { onMounted } from "vue";

import RecipeLinkEditForm from "./RecipeLinkEditForm.vue";
import newTabIcon from "assets/graphics/icons/new-tab-icon.svg";
import ExpandTransition from "~/components/Transitions/Expand.vue";
import SettingsDropdown from "~/components/SettingsDropdown.vue";
import Alert from "~/components/Alert.vue";

import { useAuthStore } from "~/store";

const authStore = useAuthStore();
const db = getDatabase();

const emit = defineEmits(["cancel", "update"]);

const props = defineProps({
  link: {
    type: Object,
    default: () => ({
      id: null,
      labels: null,
      url: null,
      title: null,
      hostName: null,
      comment: null,
    }),
  },
  addingToCategory: {
    type: String,
    default: null,
  },
});

const editMode = ref(false);
const showAlert = ref(false);
const systemMessage = ref(null);

const labels = computed(() => {
  return props.link?.labels?.split(",");
});

function cancelEdit() {
  editMode.value = false;
  emit("cancel");
}

function toggleEditMode(event) {
  event && event.stopPropagation();
  editMode.value = !editMode.value;
}

function updateLink() {
  emit("update");
  toggleEditMode();
}

function toggleAlert(event) {
  event && event.stopPropagation();
  showAlert.value = !showAlert.value;
}

function openLink(event) {
  event && event.stopPropagation();
  const url = props.link?.url;
  if (url) window.open(url, "_blank");
}

function deleteLink() {
  if (props.link?.id && authStore.user?.id) {
    remove(dbRef(db, `users/${authStore.user.id}/recipeLinks/${props.link.id}`))
      .then(() => {
        showAlert.value = false;
        updateLink();
      })
      .catch((error) => {
        systemMessage.value = error.message;
        console.error("[deleteLink]", error.message);
      });
  }
}

onMounted(() => {
  if (props.link && !props.link.url) {
    editMode.value = true;
  }
});
</script>
