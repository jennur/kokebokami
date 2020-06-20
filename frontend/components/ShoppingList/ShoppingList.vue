<template>
  <section class="shopping-list margin-bottom--large">
    <!-- Shopping list title -->
    <div class="shopping-list__title">
      <div
        v-if="title && !editTitle"
        class="flex-row flex-rot--align-center margin-bottom--xxlarge"
      >
        <h2 class="margin-bottom--small margin-right--large">{{mainListTitle}}</h2>
        <button class="button button--small button--transparent" @click="toggleEditTitle">Edit title</button>
      </div>
      <!-- Edit mode for title -->
      <div v-if="editTitle" class="flex-row flex-row--align-center margin-bottom--xxlarge">
        <input type="text" v-model="mainListTitle" />
        <div class="flex-row flex-row--align-center flex-row--nowrap margin-top--medium">
          <button class="button button--small button--round" @click="saveTitle">Save title</button>
          <button class="button button--small button--cancel" @click="toggleEditTitle">✕ Cancel</button>
        </div>
      </div>
    </div>
    <!-- Sublists -->
    <div class="flex-row">
      <sub-list
        v-for="(subList, index) in subLists"
        :key="`shopping-list-${index}`"
        :subList="subList[1]"
        :subListKey="subList[0]"
        :parentTitle="title"
        :mainListKey="mainListKey"
        @update="updateSubLists"
      />
      <sub-list
        v-if="addingNewSubList"
        :subList="{title: '', listItems: []}"
        :subListKey="''"
        :parentTitle="title"
        :mainListKey="mainListKey"
        @update="updateSubLists"
      />
    </div>
    <div class="flex-row flex--align-center flex--space-between full-width">
      <increment-button
        class="margin-vertical--large margin-right--xxlarge"
        @increment="addingNewSubList = true"
      >Add new sublist</increment-button>

      <div
        v-if="mainListKey"
        class="button button--small button--transparent button--transparent-red margin-vertical--large"
        @click="deleteShoppingList"
      >Delete collection</div>
      <button
        v-if="!mainListKey"
        class="button button--small button--cancel"
        @click="$emit('cancel')"
      >Cancel</button>
    </div>
  </section>
</template>

<script>
import user from "~/mixins/user.js";

import IncrementButton from "~/components/Input/IncrementButton.vue";
import DecrementButton from "~/components/Input/DecrementButton.vue";
import SubList from "./SubList.vue";

export default {
  name: "shopping-list",
  components: {
    IncrementButton,
    DecrementButton,
    SubList
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    mainListKey: {
      type: String,
      default: ""
    },
    subLists: {
      type: Array,
      default: () => []
    }
  },
  mixins: [user],
  data() {
    return {
      mainListTitle: this.title,
      editTitle: false,
      addingNewSubList: false
    };
  },
  methods: {
    toggleEditTitle() {
      this.editTitle = !this.editTitle;
      this.$emit("update");
    },
    saveTitle() {
      let componentThis = this;
      let mainListKey = this.mainListKey;
      let title = this.mainListTitle;

      let shoppingListRef = this.$fireDb.ref(
        `users/${this.user.id}/shoppingLists/`
      );
      let thisListRef = this.$fireDb.ref(
        `users/${this.user.id}/shoppingLists/${mainListKey}`
      );
      if (mainListKey) {
        thisListRef
          .update({ title })
          .then(() => {
            console.log("Title updated");
            componentThis.toggleEditTitle();
          })
          .catch(error => {
            console.log("Title update failed:", error.message);
          });
      } else {
        shoppingListRef.once("value", snapshot => {
          shoppingListRef
            .push({ title })
            .then(mainListObject => {
              console.log("New main list added", mainListObject.key);
              componentThis.toggleEditTitle();
            })
            .catch(error => {
              console.log("Title update failed:", error.message);
            });
        });
      }
    },
    addNewSubList() {
      this.addingNewSubList = true;
    },
    updateSubLists() {
      console.log("Updating in shoppingListComponent");
      this.addingNewSubList = false;
      this.$emit("update");
    },
    deleteShoppingList() {
      let componentThis = this;
      let mainListKey = this.mainListKey;
      let mainListRef = this.$fireDb.ref(
        `users/${this.user.id}/shoppingLists/${mainListKey}`
      );
      mainListRef
        .remove()
        .then(() => {
          console.log("Successfully deleted shopping list", mainListKey);
          componentThis.$emit("update");
        })
        .catch(error =>
          console.log("Error deleting shopping list:", error.message)
        );
    }
  },
  updated() {
    console.log("SubLists:", this.subLists);
  }
};
</script>
