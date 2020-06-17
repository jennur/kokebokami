<template>
  <section class="sub-list margin-bottom--large">
    <div class="sub-list__title">
      <h3 v-if="!editMode && title" class="heading--blue">{{title}}</h3>
      <label v-if="editMode" class="flex-column">
        <input type="text" v-model="title" placeholder="Sublist title" />
      </label>
    </div>
    <ul class="sub-list__items">
      <li
        v-for="(item, index) in listItems"
        :key="`list-item-${index}`"
        :data-list-item="`list-item-${index}`"
        class="margin-top--small"
      >
        <div v-if="editMode">
          <input type="text" v-model="listItems[index].text" />
          <decrement-button @decrement="removeListItem(index)" />
        </div>
        <label v-else :class="{
            'complete': listItems[index].complete
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
    <div class="flex-row margin-vertical--xlarge">
      <increment-button class="margin-right--medium" @increment="addNewListItem">Add item</increment-button>
      <button
        v-if="editMode"
        class="button button--round button--round-small padding-horizontal--xlarge"
        @click="saveShoppingList"
      >Save sublist</button>
    </div>
    <button
      class="button button--small button--transparent button--transparent-red margin-top--xxlarge"
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
    parentTitle: {
      type: String,
      default: ""
    },
    parentKey: {
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
    let subList = this.subList && JSON.parse(JSON.stringify(this.subList));
    return {
      editMode: this.subList && !this.subList.listItems.length,
      title: (subList && subList.title) || "",
      listItems: (subList && subList.listItems) || []
    };
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
    saveShoppingList() {
      let componentThis = this;
      let shoppingLists = [];
      let backupTitle = this.createBackupTitle();
      let title = this.title || backupTitle;
      this.title = title;
      let listItems = this.listItems;
      let originalTitle = this.subList.title;
      let subListKey = this.subListKey;
      let parentTitle = this.parentTitle || "New shopping list";

      let shoppingListsRef = this.$fireDb.ref(
        `users/${this.user.id}/shoppingLists`
      );

      let subListRef = this.$fireDb.ref(
        `users/${this.user.id}/shoppingLists/${this.parentKey}`
      );
      if (this.parentKey) {
        subListRef.once("value", snapshot => {
          if (snapshot.exists()) {
            console.log("Snapshot exists:", snapshot.val());

            if (subListKey !== "") {
              subListRef
                .child("subLists")
                .child(subListKey)
                .set({ title, listItems })
                .then(() => console.log("Update shoppingList in store"))
                .catch(error =>
                  console.log("Error updating subList:", error.message)
                );
            } else {
              console.log("No sublist key");
              subListRef
                .child("subLists")
                .push({ title, listItems })
                .then(() => console.log("Update shoppingList in store"))
                .catch(error =>
                  console.log("Error setting subList:", error.message)
                );
            }
          }
        });
      } else {
        console.log("Main list does not exist");
        console.log("Title:", parentTitle);
        let listKey = shoppingListsRef.push({
          title: parentTitle
        }).key;
        shoppingListsRef
          .child(listKey)
          .child("subLists")
          .push({ title, listItems });
      }
      /*
      let userObj = { ...this.user, shoppingLists };
      this.$store.dispatch("SET_USER", userObj);
      this.editMode = false; */
    },
    deleteSubList() {
      if (this.user && this.user.shoppingLists) {
        let shoppingLists = JSON.parse(JSON.stringify(this.user.shoppingLists));
        let userObj = { ...this.user, shoppingLists };
        this.$store.dispatch("SET_USER", userObj);

        let subListRef = this.$fireDb.ref(
          `users/${this.user.id}/shoppingLists/${this.parentTitle}/${this.title}`
        );
        subListRef
          .remove()
          .then(() => {
            console.log("Succesfully deleted sublist");
          })
          .catch(error =>
            console.log("Error deleting sublist:", error.message)
          );
      }
    },
    handleComplete(index) {
      let complete = this.listItems[index].complete;
      this.listItems[index].complete = !complete;
      this.saveShoppingList();
    },
    createBackupTitle() {
      let randomList1 = [
        "Surprise",
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
      return `${randomList1[Math.round(Math.random() * 10)]} ${
        randomList2[Math.round(Math.random() * 10)]
      } of ${randomList3[Math.round(Math.random() * 10)]}`;
    }
  },
  created() {
    console.log("SubList:", this.subList);
  }
};
</script>
