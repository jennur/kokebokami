<template>
  <section class="shopping-list margin-bottom-lg">

    <!-- Share action -->
    <div class="flex-row flex-row--align-center margin-bottom-lg">
      <div v-if="list && list.key">
        <share-icon class="icon icon--blue" @click="toggleShareBox" />

        <shareBox
          :open="sharing"
          :listKey="list.key"
          :listTitle="list.title"
          @shared="follower => sendEmail(follower)"
          @close-modal="toggleShareBox"
        />
      </div>
    </div>

    <!-- Delete / Cancel action -->
    <div class="shopping-list_cancel-action">
      <settings-dropdown v-if="list.key" :right="true">
        <span class="system-message" @click="toggleAlert">
          <delete-icon tabindex="0" class="icon margin-right-md" />
          {{ $t('shoppingLists.deleteCollection')}}
        </span>
      </settings-dropdown>

      <button v-if="!list.key" class="button button--dynamic button--cancel" @click="$emit('cancel')">
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
      <div v-if="list.title && !editTitle" class="flex-row flex-row--align-center margin-top-lg">
        <h2 class="margin-bottom-sm margin-right-lg" @click="event => toggleEditTitle(event)">
          {{ list.title }}
        </h2>

        <!--   Shared-from list     -->
        <span v-if="shared" class="shopping-list_shared">
          {{$t('shoppingLists.sharedBy')}}:
          <NuxtLink :to="`/cooks/${createdByCookPath}`">
            {{ list.createdBy.displayName }}
          </NuxtLink>
        </span>

        <!--   Shared-with list     -->
        <span v-if="sharedWith" class="shopping-list_shared">
          {{$t('shoppingLists.sharedWith')}}:
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
          @keydown="event => { event.keyCode === 13 && saveTitle() }"
        />
      </div>
    </div>

    <!-- Sublists -->
    <div class="flex-row">
      <sub-list
        v-for="(subList, index) in subLists"
        :key="`shopping-list-${index}`"
        :subList="subList[1]"
        :subListKey="subList[0]"
        :mainListTitle="list.title"
        :mainListKey="list.key"
        @update="updateSubLists"
      />
      <sub-list
        v-if="addingNewSubList"
        :subList="{ title: '', listItems: [] }"
        :subListKey="''"
        :mainListTitle="list.title"
        :mainListKey="list.key"
        @update="updateSubLists"
      />
    </div>

    <div class="flex-row flex-row--align-center flex-row--space-between full-width">
      <increment-button class="margin-v-lg margin-right-2xl" @increment="addNewSubList">
        {{$t('shoppingLists.newSublist')}}
      </increment-button>
    </div>
  </section>
</template>

<script>
import { getDatabase, ref, get } from "firebase/database";

import axios from "axios";
 
import shareIcon from "~/assets/graphics/icons/shareicon.svg";

import user from "~/composables/user.js";

import SettingsDropdown from "~/components/SettingsDropdown.vue";
import Alert from "~/components/Alert.vue";
import ShareBox from "./ShareBox.vue";
import IncrementButton from "~/components/Input/IncrementButton.vue";
import DecrementButton from "~/components/Input/DecrementButton.vue";
import SubList from "./SubList.vue";

import generatePath from '~/helpers/generatePath';
import { shoppingListTemplate } from "~/helpers/email-templates.js";

export default {
  name: "shopping-list",
  components: {
    shareIcon,
    SettingsDropdown,
    Alert,
    ShareBox,
    IncrementButton,
    DecrementButton,
    SubList
  },
  props: {
    list: {
      type: Object,
      default: () => {}
    }
  },
  mixins: [user],
  data() {
    return {
      updatedTitle: this.list && this.list.title,
      editTitle: false,
      addingNewSubList: false,
      sharing: false,
      showAlert: false
    };
  },
  computed: {
    createdByCookPath(){
      let createdBy = this.list.createdBy;
      return generatePath(createdBy.displayName, createdBy.id);
    },
    shared() {
      let createdByID = this.list.createdBy && this.list.createdBy.id;
      return createdByID && createdByID !== this.user.id;
    },
    sharedWith() {
      let createdByID = this.list.createdBy && this.list.createdBy.id;
      let sharedWith = [];
      if (createdByID === this.user.id) {
        sharedWith = Object.values(this.list.owners).filter(
          user => user.id !== this.user.id
        );
      }
      return sharedWith.length && sharedWith;
    },
    subLists() {
      let subLists = this.list.subLists;
      return (subLists && Object.entries(subLists)) || [];
    }
  },
  methods: {
    sharedWithUrl(user){
      return user && generatePath(user.displayName, user.id);
    },
    toggleAlert() {
      this.showAlert = !this.showAlert;
    },
    toggleShareBox() {
      this.sharing = !this.sharing;
    },
    toggleEditTitle(event) {
      this.editTitle = !this.editTitle;
      event && event.stopPropagation();
    },
    saveTitle() {
      this.addingNewSubList = false;
      let mainListKey = this.list.key;

      if (this.list.title !== this.updatedTitle) {
        let title = this.updatedTitle;

        if (mainListKey) {
          const db = getDatabase();
            ref(db, `shoppingLists/${mainListKey}`)
            .update({ title })
            .then(() => {
              console.log("Title updated");
              this.toggleEditTitle();
              this.$emit("update");
            })
            .catch(error => {
              console.log("Title update failed:", error.message);
            });
        } else {
          let currentUserObj = { id: this.user.id, displayName: this.user.displayName };
          const db = getDatabase();
            ref(db, `shoppingLists`)
            .push({
              title,
              createdBy: currentUserObj,
              owners: [currentUserObj]
            })
            .then(() => {
              console.log("New main list added");
              this.toggleEditTitle();
              this.$emit("update");
            })
            .catch(error => {
              console.log("Title update failed while adding new shopping list:", error.message);
            });
        }
      } else {
        this.toggleEditTitle();
      }
    },
    addNewSubList() {
      this.addingNewSubList = true;
    },
    updateSubLists() {
      this.addingNewSubList = false;
      this.$emit("update");
    },
    sendEmail(receiver) {
      let sender = this.user.displayName;
      let message = shoppingListTemplate(receiver.displayName, sender, this.list.title);
      axios.post("/api/send-email", {
              receiverID: receiver.id,
              subject: `${sender} just shared a shopping list with you 📝`,
              message
            })
            .catch(error => console.log("Error:", error));
    },
    deleteShoppingList() {
      let mainListRef = ref(db, `shoppingLists/${this.list.key}`);
      let ownersRef = ref(db, `shoppingLists/${this.list.key}/owners`);

      let owners = this.list.owners && Object.values(this.list.owners);

      if (owners.length <= 1) {
        // Remove completely from database
        mainListRef
          .remove()
          .then(() => {
            console.log("Successfully deleted shopping list");
            this.toggleAlert();
            this.$emit("update");
          })
          .catch(error =>
            console.log("Error deleting shopping list:", error.message)
          );
      } else {
        //Delete only for current user
        ownersRef.once("value", snapshot => {
          if (snapshot.exists()) {
            let owners = Object.entries(snapshot.val());

            owners = owners.filter(user => {
              return user[1].id !== this.user.id;
            });

            owners = Object.fromEntries(owners);
            mainListRef
              .update({ owners })
              .then(() => {
              this.toggleAlert();
              this.$emit("update");
            });
          }
        });
      }
    }
  },
  
};
</script>
