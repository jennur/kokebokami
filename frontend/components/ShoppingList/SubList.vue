<template>
  <section class="sub-list margin-vertical--large">
    <div class="flex-row flex-row--align-top flex-row--nowrap">
      <deleteIcon
        v-if="subListKey"
        class="icon margin-top--medium margin-right--medium"
        @click="deleteSubList"
      />
      <div class="sub-list-container">
        <sub-list-title
          :mainListKey="mainListKey"
          :subListKey="subListKey"
          :title="subList.title || this.createBackupTitle()"
          @update="$emit('update')"
          @deleteSubList="deleteSubList"
        />
        <sub-list-list-items
          :mainListKey="mainListKey"
          :subListKey="subListKey"
          :listItems="subList.listItems"
          @update="$emit('update')"
        />
      </div>
    </div>
  </section>
</template>

<script>
import ClickOutside from "vue-click-outside";

import user from "~/mixins/user.js";

import deleteIcon from "~/assets/graphics/icons/delete-icon.svg";

import SubListTitle from "./SubList/SubListTitle.vue";
import SubListListItems from "./SubList/SubListListItems.vue";

export default {
  name: "sub-list",
  components: {
    deleteIcon,
    SubListTitle,
    SubListListItems
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
  methods: {
    toggleEditTitle() {
      this.editTitle = !this.editTitle;
    },
    toggleEditListItems() {
      this.editListItems = !this.editListItems;
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
    },
    deleteSubList() {
      let componentThis = this;
      let mainListKey = this.mainListKey;
      let subListKey = this.subListKey;

      if (
        mainListKey &&
        subListKey &&
        confirm(
          `Are you sure you want to delete sublist "${this.subList.title}"?`
        )
      ) {
        let subListRef = this.$fireDb.ref(
          `shoppingLists/${mainListKey}/subLists/${subListKey}`
        );
        subListRef
          .remove()
          .then(() => {
            console.log("Succesfully deleted sublist");
            componentThis.editListItems = false;
            componentThis.$emit("update");
          })
          .catch(error =>
            console.log("Error deleting sublist:", error.message)
          );
      }
    }
  }
};
</script>
