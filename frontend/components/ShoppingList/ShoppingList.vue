<template>
  <section>
    <div class="shopping-list">
      <ul>
        <li
          v-for="(item, index) in listItems"
          :key="`list-item-${index}`"
          :data-list-item="`list-item-${index}`"
          class="margin-top--small"
        >
          <div v-if="editMode">
            <input type="text" v-model="listItems[index]" />
            <decrement-button @decrement="removeListItem(index)" />
          </div>
          <label v-else>
            <input
              tabindex="0"
              type="checkbox"
              @change="event => toggleCompleteClass(event.target)"
            />
            {{ item }}
          </label>
        </li>
      </ul>
      <div class="flex-row">
        <increment-button
          class="margin-right--medium"
          @increment="addNewListItem"
          >Add item</increment-button
        >
        <button
          v-if="editMode"
          class="button button--round button--round-small padding-horizontal--xlarge"
          @click="saveShoppingList"
        >
          Save
        </button>
      </div>
      <button
        class="button button--small button--transparent button--transparent-red margin-top--xxlarge"
        @click="clearShoppingList"
      >
        Clear shopping list
      </button>
    </div>
  </section>
</template>

<script>
import IncrementButton from "~/components/Input/IncrementButton.vue";
import DecrementButton from "~/components/Input/DecrementButton.vue";

export default {
  name: "shopping-list",
  components: {
    IncrementButton,
    DecrementButton
  },
  props: {
    user: {
      type: Object,
      default: {}
    },
    shoppingList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    let shoppingList = JSON.parse(JSON.stringify(this.shoppingList));
    return {
      editMode: false,
      listItems: shoppingList || []
    };
  },
  methods: {
    addNewListItem() {
      this.editMode = true;
      this.listItems.push("");
    },
    removeListItem(index) {
      let listItems = this.listItems;
      this.listItems.splice(index, 1);
    },
    saveShoppingList() {
      let userRef = this.$fireDb.ref(`users/${this.user.id}/shoppingList`);
      userRef.set(this.listItems);
      let userObj = { ...this.user, shoppingList: this.listItems };
      this.$store.dispatch("SET_USER", userObj);
      this.editMode = false;
    },
    clearShoppingList() {
      this.listItems = [];
      this.saveShoppingList();
    },
    toggleCompleteClass(target) {
      target.parentElement.classList.toggle("complete");
    }
  }
};
</script>
