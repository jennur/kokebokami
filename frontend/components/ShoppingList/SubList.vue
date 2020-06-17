<template>
  <section class="shopping-list margin-bottom--large">
    <div class="shopping-list__title">
      <h3 v-if="!editMode && title" class="heading--blue">{{title}}</h3>
      <label v-if="editMode" class="flex-column">
        <input type="text" v-model="title" placeholder="Shopping list title" />
      </label>
    </div>
    <ul class="shopping-list__items">
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
    <div class="flex-row margin-bottom--xlarge">
      <increment-button class="margin-right--medium" @increment="addNewListItem">Add item</increment-button>
      <button
        v-if="editMode"
        class="button button--round button--round-small padding-horizontal--xlarge"
        @click="saveShoppingList"
      >Save</button>
    </div>
    <button
      class="button button--small button--transparent button--transparent-red margin-top--xxlarge"
      @click="clearShoppingList"
    >Clear shopping list</button>
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
    subList: {
      type: Array,
      default: () => []
    }
  },
  mixins: [user],
  data() {
    let subList = this.subList && JSON.parse(JSON.stringify(this.subList));
    return {
      editMode: this.subList && !this.subList[1].length,
      title: (subList && subList[0]) || "",
      listItems: (subList && subList[1]) || []
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
      let subList = this.listItems;
      let shoppingList = [];
      if (this.user && this.user.shoppingList) {
        shoppingList = JSON.parse(JSON.stringify(this.user.shoppingList));
      }
      let backupTitle = `${randomList1[Math.round(Math.random() * 10) - 1]} ${
        randomList2[Math.round(Math.random() * 10) - 1]
      } of ${randomList3[Math.round(Math.random() * 10) - 1]}`;
      this.title = this.title || backupTitle;

      shoppingList[this.title] = subList;

      let shoppingListRef = this.$fireDb.ref(
        `users/${this.user.id}/shoppingList/${this.title}`
      );
      shoppingListRef.set(subList);

      let userObj = { ...this.user, shoppingList };
      this.$store.dispatch("SET_USER", userObj);
      this.editMode = false;
    },
    clearShoppingList() {
      this.listItems = [];
      this.saveShoppingList();
    },
    handleComplete(index) {
      let complete = this.listItems[index].complete;
      this.listItems[index].complete = !complete;
      this.saveShoppingList();
    }
  }
};
</script>
