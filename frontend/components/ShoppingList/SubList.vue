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
      v-if="newSubListKey"
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
    parentTitle: {
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
    let subList = this.subList && JSON.parse(JSON.stringify(this.subList));
    return {
      editMode: this.subList && !this.subList.listItems.length,
      title: (subList && subList.title) || "",
      listItems: (subList && subList.listItems) || [],
      newSubListKey: this.subListKey || ""
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

      let shoppingLists = JSON.parse(JSON.stringify(this.user.shoppingLists));
      let mainListKey = this.mainListKey;
      let parentTitle = this.parentTitle || "New shopping list";
      let originalTitle = this.subList.title;

      let backupTitle = this.createBackupTitle();
      let title = this.title || backupTitle;
      this.title = title;
      let listItems = this.listItems;
      let subListKey = this.subListKey;

      let shoppingListsRef = this.$fireDb.ref(
        `users/${this.user.id}/shoppingLists`
      );

      let subListRef = this.$fireDb.ref(
        `users/${this.user.id}/shoppingLists/${mainListKey}`
      );
      if (mainListKey) {
        subListRef.once("value", snapshot => {
          if (snapshot.exists()) {
            console.log("Snapshot exists:", snapshot.val());

            //Check if subList exists and is not recently deleted
            if (subListKey !== "" && componentThis.newSubListKey !== "") {
              subListRef
                .child("subLists")
                .child(subListKey)
                .set({ title, listItems })
                .then(() => {
                  console.log("Updating shoppingList in store");
                  shoppingLists[mainListKey].subLists[subListKey] = {
                    title,
                    listItems
                  };
                  let userObj = { ...componentThis.user, shoppingLists };
                  componentThis.$store.dispatch("SET_USER", userObj);
                  componentThis.editMode = false;
                })
                .catch(error =>
                  console.log("Error updating subList:", error.message)
                );
            } else {
              console.log("No sublist key");
              subListRef
                .child("subLists")
                .push({ title, listItems })
                .then(result => {
                  console.log("Updating shoppingList in store", result);
                  let subListKey = result.key;
                  componentThis.newSubListKey = subListKey;
                  if (shoppingLists[mainListKey].subLists) {
                    shoppingLists[mainListKey].subLists[result.key] = {
                      title,
                      listItems
                    };
                  } else {
                    shoppingLists[mainListKey].subLists = {
                      resultKey: {
                        title,
                        listItems
                      }
                    };
                  }

                  let userObj = { ...componentThis.user, shoppingLists };
                  componentThis.$store.dispatch("SET_USER", userObj);
                  componentThis.editMode = false;
                })
                .catch(error =>
                  console.log("Error setting subList:", error.message)
                );
            }
          }
        });
      } else {
        console.log("Main list does not exist");
        let newMainListKey = shoppingListsRef.push({
          title: parentTitle
        }).key;
        shoppingListsRef
          .child(newMainListKey)
          .child("subLists")
          .push({ title, listItems })
          .then(result => {
            console.log("Updating shoppingList in store", result);
            shoppingLists[newMainListKey].subLists[result.key] = {
              title,
              listItems
            };
            let userObj = { ...componentThis.user, shoppingLists };
            console.log("UserObjs:", userObj);
            componentThis.$store.dispatch("SET_USER", userObj);
            componentThis.editMode = false;
          });
      }
    },
    deleteSubList() {
      let componentThis = this;

      let mainListKey = this.mainListKey;
      let subListKey = this.subListKey;

      if (this.user && this.user.shoppingLists) {
        let shoppingLists = JSON.parse(JSON.stringify(this.user.shoppingLists));
        let userObj = { ...this.user, shoppingLists };
        this.$store.dispatch("SET_USER", userObj);

        let subListRef = this.$fireDb.ref(
          `users/${this.user.id}/shoppingLists/${mainListKey}/subLists/${subListKey}`
        );
        console.log(
          "SublistRef:",
          `users/${this.user.id}/shoppingLists/${mainListKey}/subLists/${subListKey}`
        );
        subListRef
          .remove()
          .then(() => {
            console.log("Updating shoppingList in store");
            delete shoppingLists[mainListKey].subLists[subListKey];
            let userObj = { ...componentThis.user, shoppingLists };
            componentThis.listItems = [];
            componentThis.title = "";
            componentThis.newSubListKey = "";
            componentThis.$store.dispatch("SET_USER", userObj);
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
