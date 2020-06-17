<template>
  <section class="shopping-list margin-bottom--large">
    <!-- Shopping list title -->

    <div class="shopping-list__title">
      <div
        v-if="title && !editTitle"
        class="flex-row flex-rot--align-center margin-bottom--xxlarge"
      >
        <h2 class="margin-bottom--small margin-right--large">{{mainListTitle}}</h2>
        <button class="button button--small button--transparent" @click="openEditTitle">Edit title</button>
      </div>
      <!-- Edit mode for title -->
      <div v-if="editTitle" class="flex-row flex-row--align-center margin-bottom--xxlarge">
        <input type="text" v-model="mainListTitle" />
        <div class="flex-row flex-row--align-center flex-row--nowrap margin-top--medium">
          <button class="button button--small button--round" @click="saveTitle">Save title</button>
          <button class="button button--small button--cancel" @click="editTitle = false">✕ Cancel</button>
        </div>
      </div>
    </div>
    <!-- Sublists -->
    <div class="flex-row">
      <sub-list
        v-for="(subList, index) in updatedSubLists"
        :key="`shopping-list-${index}`"
        :subList="subList[1]"
        :subListKey="subList[0]"
        :parentTitle="title"
        :parentKey="listKey"
      />
    </div>
    <increment-button
      class="margin-bottom--xxlarge margin-top--large"
      @increment="addNewSubList"
    >Add new sublist</increment-button>
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
    listKey: {
      type: String,
      default: ""
    },
    subLists: {
      type: Object,
      default: () => {}
    }
  },
  mixins: [user],
  data() {
    return {
      mainListTitle: this.title,
      editTitle: false,
      updatedSubLists: []
    };
  },
  methods: {
    openEditTitle() {
      this.editTitle = true;
    },
    saveTitle() {
      let componentThis = this;
      let shoppingListRef = this.$fireDb.ref(
        `users/${this.user.id}/shoppingLists/`
      );
      let title = this.mainListTitle;
      shoppingListRef
        .once("value", snapshot => {
          if (snapshot.exists()) {
            let listKey = Object.keys(snapshot.val())[0];
            let thisListRef = shoppingListRef.child(listKey);
            //Update title
            thisListRef
              .update({ title })
              .then(() => {
                console.log("Title updated");
                let shoppingLists = JSON.parse(
                  JSON.stringify(componentThis.user.shoppingLists)
                );
                shoppingLists[listKey].title = title;
                let userObj = { ...componentThis.user, shoppingLists };
                componentThis.$store.dispatch("SET_USER", userObj);
                componentThis.editTitle = false;
              })
              .catch(error => {
                console.log("Title update failed:", error.message);
              });
          } else {
            //Create a new list object
            shoppingListRef.push({
              title: componentThis.mainListTitle,
              subLists: []
            });
          }
        })
        .catch(error => console.log("Error saving title:", error));
    },
    addNewSubList() {
      this.updatedSubLists.push(["", { title: "", listItems: [] }]);
    }
  },
  created() {
    this.updatedSubLists =
      (this.subLists && Object.entries(this.subLists)) || [];
    console.log("UpdatedSubLists:", this.updatedSubLists);
  }
};
</script>
