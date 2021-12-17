<template>
  <div>
    <ul v-if="!editMode && listItems" class="sub-list_items">
      <li
        v-for="(item, index) in listItems"
        :key="`list-item-${index}`"
        :data-list-item="`list-item-${index}`"
        class="margin-v-md"
      >
        <label
          :class="{
            complete: listItems[index].complete
          }"
        >
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
    <ul v-if="editMode" class="sub-list_items">
      <li
        v-for="(listItem, index) in updatedListItems"
        :key="`edit-list-item-${index}`"
        class="margin-top-sm"
      >
        <input type="text" v-model="updatedListItems[index].text" />
        <decrement-button @decrement="removeListItem(index)" />
      </li>
    </ul>
    <button v-if="!editMode"
            @click="toggleEditMode" 
            class="button button-xs button--green-border button--round"
            tabindex="0"
    >
      {{$t('editList')}}
      <edit-icon class="icon margin-left-sm"/>
    </button>
    
    <div v-if="editMode" class="flex-row flex-row--align-center">
      <increment-button
        class="margin-right-md margin-v-lg"
        @increment="addNewListItem"
        >{{$t('addItem')}}</increment-button
      >
      <button
        v-if="listItems.length"
        class="button button-xs button--round padding-h-lg margin-v-lg"
        @click="saveListItems"
      >
        {{$t('save')}}
      </button>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
import user from "~/mixins/user.js";

import IncrementButton from "~/components/Input/IncrementButton.vue";
import DecrementButton from "~/components/Input/DecrementButton.vue";

export default {
  name: "sublist-list-items",
  components: {
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
      this.updatedListItems.splice(index, 1);
    },
    handleComplete(index) {
      let complete = this.updatedListItems[index].complete;
      this.updatedListItems[index].complete = !complete;
      this.saveListItems();
    },
    saveListItems() {
      let mainListKey = this.mainListKey;
      let listItems = this.updatedListItems;
      let subListKey = this.subListKey;

      let mainListRef = this.$fire.database.ref(`shoppingLists/${mainListKey}`);

      if (mainListKey && subListKey !== "") {
        mainListRef
          .child("subLists")
          .child(subListKey)
          .update({ listItems })
          .then(() => {
            //console.log("Sublist successfully updated");
            this.editMode = false;
            this.$emit("update");
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
            this.editMode = false;
            this.$emit("update");
          })
          .catch(error => console.log("Error setting subList:", error.message));
      }
      else {
        console.log("Something went wrong while trying to add/update sublist");
      }
    }
  },
  directives: { ClickOutside }
};
</script>
