<template>
  <div>
    <ul v-if="!editMode && listItems" class="sub-list__items">
      <li
        v-for="(item, index) in listItems"
        :key="`list-item-${index}`"
        :data-list-item="`list-item-${index}`"
        class="margin-vertical--medium"
      >
        <label :class="{
            complete: listItems[index].complete
          }">
          <input
            tabindex="0"
            type="checkbox"
            :checked="listItems[index].complete"
            @change="event => handleComplete(index)"
          />
          {{ item.text }}
        </label>
      </li>
    </ul>
    <ul v-if="editMode" class="sub-list__items">
      <li
        v-for="(listItem, index) in updatedListItems"
        :key="`edit-list-item-${index}`"
        class="margin-top--small"
      >
        <input type="text" v-model="updatedListItems[index].text" />
        <decrement-button @decrement="removeListItem(index)" />
      </li>
    </ul>
    <editIcon v-if="!editMode" class="icon margin--small" @click="toggleEditMode" />
    <div v-if="editMode" class="flex-row flex-row--align-center">
      <increment-button
        class="margin-right--medium margin-vertical--large"
        @increment="addNewListItem"
      >Add item</increment-button>
      <button
        v-if="listItems.length"
        class="button button--xsmall button--dynamic button--cancel margin-left--medium margin-vertical--large"
        @click="saveListItems"
      >✕ Close</button>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";

import editIcon from "~/assets/graphics/icons/edit-icon.svg";

import user from "~/mixins/user.js";

import IncrementButton from "~/components/Input/IncrementButton.vue";
import DecrementButton from "~/components/Input/DecrementButton.vue";

export default {
  name: "sublist-list-items",
  components: {
    editIcon,
    IncrementButton,
    DecrementButton
  },
  props: {
    mainListKey: {
      type: String,
      default: ""
    },
    subListKey: {
      type: String,
      default: ""
    },
    listItems: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      editMode: !this.listItems.length,
      updatedListItems: this.listItems || []
    };
  },
  mixins: [user],
  watch: {
    listItems: function(val) {
      this.updatedListItems = val;
    }
  },
  methods: {
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    addNewListItem() {
      this.updatedListItems.push({ text: "", complete: false });
    },
    removeListItem(index) {
      let listItems = this.updatedListItems;
      this.updatedListItems.splice(index, 1);
    },
    handleComplete(index) {
      let complete = this.updatedListItems[index].complete;
      this.updatedListItems[index].complete = !complete;
      this.saveListItems();
    },
    saveListItems() {
      let componentThis = this;
      let userID = this.user.id;

      let mainListKey = this.mainListKey;
      let mainListTitle = this.mainListTitle || "New shopping list";

      let listItems = this.updatedListItems;
      let subListKey = this.subListKey;

      let shoppingListsRef = this.$fireDb.ref(`shoppingLists`);
      let mainListRef = this.$fireDb.ref(`shoppingLists/${mainListKey}`);

      if (mainListKey && subListKey !== "") {
        mainListRef
          .child("subLists")
          .child(subListKey)
          .update({ listItems })
          .then(() => {
            //console.log("Sublist successfully updated");
            componentThis.editMode = false;
            componentThis.$emit("update");
          })
          .catch(error =>
            console.log("Error updating subList:", error.message)
          );
      } else if (mainListKey && subListKey === "") {
        console.log("Adding new sublist");
        mainListRef
          .child("subLists")
          .push({ listItems })
          .then(result => {
            console.log("Successfully added new sublist");
            componentThis.editMode = false;
            componentThis.$emit("update");
          })
          .catch(error => console.log("Error setting subList:", error.message));
      } /* else if (!mainListKey) {
        console.log("Adding new main list");
        shoppingListsRef
          .push({
            title: mainListTitle,
            createdBy: { id: userID, displayName: username },
                owners: [{ id: userID, displayName: username }]
          })
          .then(result => {
            shoppingListsRef
              .child(result.key)
              .child("subLists")
              .push({ listItems })
              .then(result => {
                console.log("Successfully added new mainlist");
                componentThis.editMode = false;
                componentThis.$emit("update");
              });
          });
      } */ else {
        console.log("Something went wrong while trying to add/update sublist");
      }
    }
  },
  directives: { ClickOutside }
};
</script>
