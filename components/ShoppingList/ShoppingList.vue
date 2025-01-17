<template>
  <section class="shopping-list margin-bottom-lg">
    <!-- Share action -->
    <div class="flex-row flex-row--align-center margin-bottom-lg">
      <div v-if="list && list.key">
        <ShareIcon class="icon icon--blue" @click="toggleShareBox" />

        <ShareBox
          :open="sharing"
          :listKey="list.key"
          :listTitle="list.title"
          @shared="(follower) => sendEmail(follower)"
          @close-modal="toggleShareBox"
        />
      </div>
    </div>

    <!-- Delete / Cancel action -->
    <div class="shopping-list_cancel-action">
      <SettingsDropdown v-if="list.key" :right="true">
        <span class="system-message" @click="toggleAlert">
          <delete-icon tabindex="0" class="icon margin-right-md" />
          {{ $t("shoppingLists.deleteCollection") }}
        </span>
      </SettingsDropdown>

      <button
        v-if="!list.key"
        class="button button--dynamic button--cancel"
        @click="$emit('cancel')"
      >
        ✕
      </button>
    </div>

    <Alert
      :alertMessage="`${$t('shoppingLists.warningText')}: '${list.title}'?`"
      :showAlert="showAlert"
      @confirmed="deleteShoppingList"
      @cancel="toggleAlert"
    />

    <!-- Shopping list title -->
    <div class="shopping-list_title margin-bottom-lg margin-top-2xl">
      <div
        v-if="list.title && !editTitle"
        class="flex-row flex-row--align-center margin-top-lg"
      >
        <h2
          class="margin-bottom-sm margin-right-lg"
          @click="(event) => toggleEditTitle(event)"
        >
          {{ list.title }}
        </h2>

        <!--   Shared-from list     -->
        <span v-if="shared" class="shopping-list_shared">
          {{ $t("shoppingLists.sharedBy") }}:
          <NuxtLink :to="`/cooks/${createdByCookPath}`">
            {{ list.createdBy.displayName }}
          </NuxtLink>
        </span>

        <!--   Shared-with list     -->
        <span v-if="sharedWith" class="shopping-list_shared">
          {{ $t("shoppingLists.sharedWith") }}:
          <NuxtLink
            v-for="(user, index) in sharedWith"
            :key="user.id"
            :to="`/cooks/${sharedWithUrl(user)}`"
          >
            {{ user.displayName }}
            {{ index !== sharedWith.length - 1 ? ", " : "" }}
          </NuxtLink>
        </span>
      </div>

      <!-- Edit mode for title -->
      <div v-if="editTitle" class="flex-row flex-row--align-center">
        <input
          type="text"
          v-model="updatedTitle"
          class="margin-right-lg"
          v-click-outside="saveTitle"
          @keydown="
            (event) => {
              event.keyCode === 13 && saveTitle();
            }
          "
        />
      </div>
    </div>

    <!-- Sublists -->
    <div class="flex-row">
      <SubList
        v-for="(subList, index) in subLists"
        :key="`shopping-list-${index}`"
        :subList="subList[1]"
        :subListKey="subList[0]"
        :mainListTitle="list.title"
        :mainListKey="list.key"
        @update="updateSubLists"
      />
      <SubList
        v-if="addingNewSubList"
        :subList="{ title: '', listItems: [] }"
        :subListKey="''"
        :mainListTitle="list.title"
        :mainListKey="list.key"
        @update="updateSubLists"
      />
    </div>

    <div
      class="flex-row flex-row--align-center flex-row--space-between full-width"
    >
      <IncrementButton
        class="margin-v-lg margin-right-2xl"
        @increment="addNewSubList"
      >
        {{ $t("shoppingLists.newSublist") }}
      </IncrementButton>
    </div>
  </section>
</template>

<script setup>
import { getDatabase, ref, get } from "firebase/database";
import axios from "axios";
import ShareIcon from "~/assets/graphics/icons/shareicon.svg";

import SettingsDropdown from "~/components/SettingsDropdown.vue";
import Alert from "~/components/Alert.vue";
import ShareBox from "./ShareBox.vue";
import IncrementButton from "~/components/Input/IncrementButton.vue";
import DecrementButton from "~/components/Input/DecrementButton.vue";
import SubList from "./SubList.vue";

import generatePath from "~/helpers/generatePath";
import { shoppingListTemplate } from "~/helpers/email-templates.js";
import { useAuthStore } from "~/store";

const db = getDatabase();
const authStore = useAuthStore();

const emit = defineEmits(["update"]);
const props = defineProps({
  list: {
    type: Object,
    default: () => {},
  },
});

const updatedTitle = ref(props.list?.title);
const editTitle = ref(false);
const addingNewSubList = ref(false);
const sharing = ref(false);
const showAlert = ref(false);

const createdByCookPath = computed(() => {
  const createdBy = props.list.createdBy;
  return generatePath(createdBy.displayName, createdBy.id);
});

const shared = computed(() => {
  const createdByID = props.list?.createdBy?.id;
  return createdByID !== authStore.user.id;
});
const sharedWith = computed(() => {
  const createdByID = props.list?.createdBy?.id;
  let sharedWith = [];
  if (createdByID === authStore.user.id) {
    sharedWith = Object.values(props.list.owners).filter(
      (user) => user.id !== authStore.user.id
    );
  }
  return sharedWith.length && sharedWith;
});

const subLists = computed(() => {
  return (props.list?.subLists && Object.entries(props.list.subLists)) || [];
});

function sharedWithUrl(user) {
  return user && generatePath(user.displayName, user.id);
}

function toggleAlert() {
  showAlert.value = !showAlert.value;
}

function toggleShareBox() {
  sharing.value = !sharing.value;
}

function toggleEditTitle(event) {
  event && event.stopPropagation();
  editTitle.value = !editTitle.value;
}

function saveTitle() {
  addingNewSubList.value = false;
  const mainListKey = props.list.key;

  if (props.list.title !== updatedTitle.value) {
    const title = updatedTitle.value;

    if (mainListKey) {
      update(ref(db, `shoppingLists/${mainListKey}`), { title })
        .then(() => {
          console.info("[saveTitle] Successfully updated main title");
          toggleEditTitle();
          emit("update");
        })
        .catch((error) => {
          console.log(
            "[saveTitle] Title update failed for main list:",
            error.message
          );
        });
    } else {
      const currentUserObj = {
        id: authStore.user.id,
        displayName: authStore.user.displayName,
      };
      push(ref(db, `shoppingLists`), {
        title,
        createdBy: currentUserObj,
        owners: [currentUserObj],
      })
        .then(() => {
          console.info("[saveTitle] New main list added");
          toggleEditTitle();
          emit("update");
        })
        .catch((error) => {
          console.error(
            "[saveTitle] Title update failed while adding new shopping list:",
            error.message
          );
        });
    }
  } else {
    toggleEditTitle();
  }
}

function addNewSubList() {
  addingNewSubList.value = true;
}

function updateSubLists() {
  addingNewSubList.value = false;
  emit("update");
}

function sendEmail(receiver) {
  const sender = authStore.user.displayName;
  const message = shoppingListTemplate(
    receiver.displayName,
    sender,
    props.list.title
  );
  axios
    .post("/api/send-email", {
      receiverID: receiver.id,
      subject: `${sender} just shared a shopping list with you 📝`,
      message,
    })
    .catch((error) => console.error("[sendEmail]", error));
}

function deleteShoppingList() {
  const mainListRef = ref(db, `shoppingLists/${props.list.key}`);
  const ownersRef = ref(db, `shoppingLists/${props.list.key}/owners`);

  const owners = props.list.owners && Object.values(props.list.owners);

  if (owners.length <= 1) {
    // Remove completely from database
    remove(mainListRef)
      .then(() => {
        console.info("[deleteShoppingList] Successfully deleted shopping list");
        toggleAlert();
        emit("update");
      })
      .catch((error) => console.error("[deleteShoppingList]", error.message));
  } else {
    //Delete only for current user
    get(ownersRef).then((snapshot) => {
      if (snapshot.exists()) {
        const currentOwnersEntries = Object.entries(snapshot.val());

        const newOwnersEntries = currentOwnersEntries.filter((user) => {
          return user[1].id !== authStore.user.id;
        });

        const newOwners = Object.fromEntries(newOwnersEntries);
        update(mainListRef, { owners: newOwners }).then(() => {
          toggleAlert();
          emit("update");
        });
      }
    });
  }
}
</script>
