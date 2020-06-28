<template>
  <section class="shopping-list margin-bottom--large">
    <button
      v-if="!editMode"
      class="button button--small button--transparent margin-bottom--xxlarge"
      @click="toggleEditMode"
    >Edit list collection</button>

    <div
      v-else
      class="flex-row flex-row--align-center flex-row--space-between margin-bottom--xxlarge"
    >
      <button
        class="button button--xsmall button--dynamic button--cancel"
        @click="toggleEditMode"
      >✕ Cancel</button>
      <div
        v-if="mainListKey"
        class="shopping-list__delete-collection-btn button button--small button--transparent button--transparent-red"
        @click="deleteShoppingList"
      >Delete collection</div>
    </div>
    <!-- Shopping list title -->
    <div class="shopping-list__title margin-bottom--xlarge">
      <div v-if="title && !editMode" class="flex-row flex-row--align-center">
        <h2 class="margin-bottom--small margin-right--large">{{title}}</h2>
      </div>

      <!-- Edit mode for title -->
      <div v-if="editMode" class="flex-row flex-row--align-center margin-bottom--xxlarge">
        <input type="text" v-model="updatedTitle" class="margin-right--large margin-top--medium" />
        <div class="flex-row flex-row--align-center flex-row--nowrap margin-top--medium">
          <button class="button button--small button--round" @click="saveTitle">Save title</button>
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
    <div class="flex-row flex-row--align-center flex-row--space-between full-width">
      <increment-button
        class="margin-vertical--large margin-right--xxlarge"
        @increment="addingNewSubList = true"
      >Add new sublist</increment-button>

      <button
        v-if="!mainListKey"
        class="button button--small button--cancel"
        @click="$emit('cancel')"
      >✕ Cancel</button>
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
      updatedTitle: this.title,
      editMode: false,
      addingNewSubList: false
    };
  },
  watch: {
    title: function(val) {
      this.updatedTitle = val;
    }
  },
  methods: {
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    addNewSubList() {
      this.addingNewSubList = true;
    },
    saveTitle() {
      this.addingNewSubList = false;
      let componentThis = this;
      let mainListKey = this.mainListKey;
      let title = this.updatedTitle;

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
            componentThis.toggleEditMode();
            componentThis.$emit("update");
          })
          .catch(error => {
            console.log("Title update failed:", error.message);
          });
      } else {
        shoppingListRef.once("value", snapshot => {
          shoppingListRef
            .push({ title })
            .then(mainListObject => {
              console.log("New main list added");
              componentThis.toggleEditMode();
              componentThis.$emit("update");
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
      this.addingNewSubList = false;
      this.$emit("update");
    },
    deleteShoppingList() {
      let componentThis = this;
      let mainListKey = this.mainListKey;
      let mainListRef = this.$fireDb.ref(
        `users/${this.user.id}/shoppingLists/${mainListKey}`
      );
      if (
        confirm(
          `Are you sure you want to delete shopping list collection "${this.title}"?`
        )
      ) {
        mainListRef
          .remove()
          .then(() => {
            console.log("Successfully deleted shopping list");
            componentThis.toggleEditMode();
            componentThis.$emit("update");
          })
          .catch(error =>
            console.log("Error deleting shopping list:", error.message)
          );
      }
    }
  }
};
</script>
