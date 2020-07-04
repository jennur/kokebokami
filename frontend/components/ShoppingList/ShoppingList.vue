<template>
  <section class="shopping-list margin-bottom--large">
    <!-- <button
      v-if="!editTitle"
      class="button button--small button--transparent margin-bottom--xxlarge"
      @click="toggleEditTitle"
    >Edit list collection</button>-->

    <div class="flex-row flex-row--justify-right margin-bottom--large">
      <div
        v-if="mainListKey"
        class="shopping-list__delete-collection-btn button button--small button--transparent button--transparent-red"
        @click="deleteShoppingList"
      >Delete collection</div>
    </div>
    <!-- Shopping list title -->
    <div class="shopping-list__title margin-bottom--large margin-top--xxlarge">
      <div v-if="title && !editTitle" class="flex-row flex-row--align-center margin-top--large">
        <h2
          class="margin-bottom--small margin-right--large"
          @click="event => toggleEditTitle(event)"
        >{{title}}</h2>
      </div>

      <!-- Edit mode for title -->
      <div v-if="editTitle" class="flex-row flex-row--align-center">
        <input
          type="text"
          v-model="updatedTitle"
          class="margin-right--large"
          v-click-outside="saveTitle"
          @keydown="event => {
          event.keyCode === 13 && saveTitle();
        }"
        />
        <div class="flex-row flex-row--align-center flex-row--nowrap margin-top--medium"></div>
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
import ClickOutside from "vue-click-outside";

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
      editTitle: false,
      addingNewSubList: false
    };
  },
  watch: {
    title: function(val) {
      this.updatedTitle = val;
    }
  },
  methods: {
    toggleEditTitle(event) {
      console.log("Toggling");
      this.editTitle = !this.editTitle;
      event && event.stopPropagation();
    },
    addNewSubList() {
      this.addingNewSubList = true;
    },
    saveTitle() {
      this.addingNewSubList = false;
      let componentThis = this;
      let mainListKey = this.mainListKey;

      if (this.title !== this.updatedTitle) {
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
              componentThis.toggleEditTitle();
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
                componentThis.toggleEditTitle();
                componentThis.$emit("update");
              })
              .catch(error => {
                console.log("Title update failed:", error.message);
              });
          });
        }
      } else {
        console.log("Closing edit mode");
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
            componentThis.toggleEditTitle();
            componentThis.$emit("update");
          })
          .catch(error =>
            console.log("Error deleting shopping list:", error.message)
          );
      }
    }
  },
  directives: {
    ClickOutside
  }
};
</script>
