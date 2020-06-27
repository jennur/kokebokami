<template>
  <section class="sub-list margin-bottom--large">
    <div class="sub-list__title">
      <h3 v-if="!editMode && title" class="heading--blue">{{subList && subList.title}}</h3>
      <label v-if="editMode" class="flex-column">
        <input type="text" v-model="title" placeholder="Sublist title" />
      </label>
    </div>
    <ul v-if="!editMode && subList && subList.listItems" class="sub-list__items">
      <li
        v-for="(item, index) in subList.listItems"
        :key="`list-item-${index}`"
        :data-list-item="`list-item-${index}`"
        class="margin-top--small"
      >
        <label :class="{
            'complete': subList.listItems[index].complete
            }">
          <input
            tabindex="0"
            type="checkbox"
            :checked="subList.listItems[index].complete"
            @change="event => handleComplete(index)"
          />
          {{ item.text }}
        </label>
      </li>
    </ul>
    <ul v-if="editMode" class="sub-list__items">
      <li
        v-for="(listItem, index) in listItems"
        :key="`edit-list-item-${index}`"
        class="margin-top--small"
      >
        <input type="text" v-model="listItems[index].text" />
        <decrement-button @decrement="removeListItem(index)" />
      </li>
    </ul>
    <div class="flex-row margin-vertical--xlarge">
      <increment-button class="margin-right--medium" @increment="addNewListItem">Add item</increment-button>
      <button
        v-if="editMode"
        class="button button--round button--round-small padding-horizontal--xlarge"
        @click="saveSubList"
      >Save sublist</button>
    </div>
    <button
      v-if="subListKey"
      class="button button--small button--transparent button--transparent-red margin-vertical--xxlarge"
      @click="deleteSubList"
    >Remove sublist</button>
  </section>
</template>

<script>
import user from "~/mixins/user.js";

import IncrementButton from "~/components/Input/IncrementButton.vue";
import DecrementButton from "~/components/Input/DecrementButton.vue";

export default {
  name: "sub-list",
  components: {
    IncrementButton,
    DecrementButton
  },
  props: {
    mainListTitle: {
      type: String,
      default: ""
    },
    mainListKey: {
      type: String,
      default: ""
    },
    subList: {
      type: Object,
      default: () => {}
    },
    subListKey: {
      type: String,
      default: ""
    }
  },
  mixins: [user],
  data() {
    let subList = this.subList;
    return {
      editMode: subList && subList.listItems && !subList.listItems.length,
      title: (subList && subList.title) || "",
      listItems: (subList && subList.listItems) || []
    };
  },
  watch: {
    subList: function(val) {
      this.listItems = (val && val.listItems) || [];
      this.title = (val && val.title) || "";
    }
  },
  methods: {
    addNewListItem() {
      this.editMode = true;
      this.listItems.push({ text: "", complete: false });
    },
    removeListItem(index) {
      let listItems = this.listItems;
      this.listItems.splice(index, 1);
    },
    saveSubList() {
      let componentThis = this;

      let mainListKey = this.mainListKey;
      let mainListTitle = this.mainListTitle || "New shopping list";

      let backupTitle = this.createBackupTitle();
      let title = this.title || backupTitle;
      this.title = title;
      let listItems = this.listItems;
      let subListKey = this.subListKey;

      let shoppingListsRef = this.$fireDb.ref(
        `users/${this.user.id}/shoppingLists`
      );

      let mainListRef = this.$fireDb.ref(
        `users/${this.user.id}/shoppingLists/${mainListKey}`
      );
      if (mainListKey && subListKey !== "") {
        mainListRef
          .child("subLists")
          .child(subListKey)
          .set({ title, listItems })
          .then(() => {
            console.log("Sublist successfully updated");
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
          .push({ title, listItems })
          .then(result => {
            console.log("Successfully added new sublist");
            componentThis.editMode = false;
            componentThis.$emit("update");
          })
          .catch(error => console.log("Error setting subList:", error.message));
      } else if (!mainListKey) {
        console.log("Adding new main list");
        let newMainListKey = shoppingListsRef
          .push({
            title: mainListTitle
          })
          .then(result => {
            shoppingListsRef
              .child(result.key)
              .child("subLists")
              .push({ title, listItems })
              .then(result => {
                console.log("Successfully added new mainlist");
                componentThis.editMode = false;
                componentThis.$emit("update");
              });
          });
      } else {
        console.log("Something went wrong while trying to add/update sublist");
      }
    },
    deleteSubList() {
      let componentThis = this;
      let mainListKey = this.mainListKey;
      let subListKey = this.subListKey;

      if (mainListKey && subListKey) {
        let subListRef = this.$fireDb.ref(
          `users/${this.user.id}/shoppingLists/${mainListKey}/subLists/${subListKey}`
        );
        subListRef
          .remove()
          .then(() => {
            console.log("Succesfully deleted sublist");
            componentThis.$emit("update");
          })
          .catch(error =>
            console.log("Error deleting sublist:", error.message)
          );
      }
    },
    handleComplete(index) {
      let complete = this.listItems[index].complete;
      this.listItems[index].complete = !complete;
      this.saveSubList();
    },
    createBackupTitle() {
      let randomList1 = [
        "Surprising",
        "Glorious",
        "Magic",
        "Incredible",
        "Amusing",
        "Fantastic",
        "Fabulous",
        "Supersticious",
        "Optimistic",
        "Magnificent"
      ];
      let randomList2 = [
        "bowl",
        "plate",
        "dish",
        "skillet",
        "pot",
        "pan",
        "cup",
        "mug",
        "jar",
        "wok"
      ];
      let randomList3 = [
        "treats",
        "goodies",
        "curiosities",
        "kickshaws",
        "delectables",
        "dainties",
        "tidbits",
        "trinkets",
        "treasures",
        "novelties"
      ];
      let index1 = Math.floor(Math.random() * 10);
      let index2 = Math.floor(Math.random() * 10);
      let index3 = Math.floor(Math.random() * 10);
      return `${randomList1[index1]} ${randomList2[index2]} of ${randomList3[index3]}`;
    }
  }
};
</script>
