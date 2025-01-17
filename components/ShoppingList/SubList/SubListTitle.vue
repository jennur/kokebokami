<template>
  <div class="sub-list_title">
    <h3
      v-if="!editMode && title"
      class="heading--blue margin--none"
      @click="(event) => toggleEditMode(event)"
    >
      {{ updatedTitle }}
    </h3>
    <label v-if="editMode" class="flex-column">
      <input
        type="text"
        v-model="updatedTitle"
        placeholder="Sublist title"
        v-click-outside="saveTitle"
        @keydown="
          (event) => {
            event.keyCode === 13 && saveTitle();
          }
        "
      />
    </label>
  </div>
</template>

<script setup>
import { getDatabase, ref, push, update, child } from "firebase/database";
import { useAuthStore } from "~/store";

const db = getDatabase();
const { t } = useI18n();
const authStore = useAuthStore();

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  mainListKey: {
    type: String,
    default: "",
  },
  subListKey: {
    type: String,
    default: "",
  },
});

const editMode = ref(false);
const updatedTitle = ref(props.title);
const isNew = ref(false);

watch(title, (value) => {
  updatedTitle.value = value;
});

function toggleEditMode(event) {
  event && event.stopPropagation();
  editMode.value = !editMode.value;
}

function saveTitle() {
  if (isNew.value || props.title !== updatedTitle.value) {
    isNew.value = false;

    const mainListKey = props.mainListKey;

    const title = updatedTitle.value;
    const subListKey = props.subListKey;

    const shoppingListsRef = ref(db, `shoppingLists`);
    const mainListRef = ref(db, `shoppingLists/${mainListKey}`);

    if (mainListKey && subListKey !== "") {
      update(child(child(mainListRef, "subLists"), subListKey), { title })
        .then(() => {
          console.info("[saveTitle] Successfully updated sublist");
          editMode.value = false;
          emit("update");
        })
        .catch((error) =>
          console.error("[saveTitle] Failed to update sublist:", error.message)
        );
    } else if (mainListKey && subListKey === "") {
      console.info("[saveTitle] Adding new sublist");
      push(child(mainListRef, "subLists"), { title })
        .then((result) => {
          console.info("[saveTitle] Successfully added new sublist");
          editMode.value = false;
          emit("update");
        })
        .catch((error) =>
          console.error("[saveTitle] Failed to add sublist:", error.message)
        );
    } else if (!mainListKey) {
      console.info("[saveTitle] Adding new main list");
      push(shoppingListsRef, {
        title: t("shoppingLists.newList"),
        createdBy: {
          id: authStore.user.id,
          displayName: authStore.user.displayName,
        },
        owners: [
          { id: authStore.user.id, displayName: authStore.user.displayName },
        ],
      }).then((result) => {
        push(child(child(shoppingListsRef, "subLists"), result.key), {
          title,
        }).then((result) => {
          console.info("[saveTitle] Successfully added new mainlist");
          editMode.value = false;
          emit("update");
        });
      });
    } else {
      console.error(
        "[saveTitle] Something went wrong while trying to add/update sublist"
      );
    }
  } else {
    toggleEditMode();
  }
}

onMounted(() => {
  if (props.subListKey === "") {
    isNew.value = true;
    saveTitle();
  }
});
</script>
