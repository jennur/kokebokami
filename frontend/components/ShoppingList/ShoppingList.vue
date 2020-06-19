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
        :mainListKey="existingListKey"
      />
    </div>
    <div class="flex-row flex--space-between full-width">
      <increment-button
        class="margin-bottom--xxlarge margin-top--large"
        @increment="addNewSubList"
      >Add new sublist</increment-button>
      <div
        class="button button--small button--transparent button--transparent-red"
      >Delete collection</div>
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
      updatedSubLists: [],
      existingListKey: this.listKey
    };
  },
  methods: {
    openEditTitle() {
      this.editTitle = true;
    },
    saveTitle() {
      let componentThis = this;
      let thisListKey = this.listKey;
      let shoppingLists = JSON.parse(JSON.stringify(this.user.shoppingLists));
      let title = this.mainListTitle;

      let shoppingListRef = this.$fireDb.ref(
        `users/${this.user.id}/shoppingLists/`
      );
      let thisListRef = this.$fireDb.ref(
        `users/${this.user.id}/shoppingLists/${thisListKey}`
      );

      if (thisListKey) {
        thisListRef
          .update({ title })
          .then(() => {
            console.log("Title updated");

            shoppingLists[thisListKey].title = title;
            let userObj = { ...componentThis.user, shoppingLists };
            componentThis.$store.dispatch("SET_USER", userObj);
            componentThis.editTitle = false;
          })
          .catch(error => {
            console.log(
              "Title update failed for listRef:",
              thisListKey,
              error.message
            );
          });
      } else {
        shoppingListRef.once("value", snapshot => {
          if (snapshot.exists()) {
            console.log("Snapshot exists", snapshot.val());
            shoppingListRef
              .push({ title })
              .then(mainListObject => {
                console.log("New main list added", mainListObject.key);
                let newListKey = mainListObject.key;
                componentThis.existingListKey = newListKey;
                shoppingLists[newListKey] = { title };
                let userObj = { ...componentThis.user, shoppingLists };
                componentThis.$store.dispatch("SET_USER", userObj);
                componentThis.editTitle = false;
              })
              .catch(error => {
                console.log("Title update failed:", error.message);
              });
          } else {
          }
        });
      }
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
