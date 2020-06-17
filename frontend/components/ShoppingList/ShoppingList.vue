<template>
  <section>
    <increment-button
      class="margin-bottom--xxlarge margin-top--large"
      @increment="addNewSubList"
    >Add new shopping list</increment-button>

    <div class="flex-row">
      <sub-list
        v-for="(subList, index) in shoppingList"
        :key="`shopping-list-${index}`"
        :subList="subList"
      />
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
  mixins: [user],
  data() {
    return {
      shoppingList: []
    };
  },
  methods: {
    addNewSubList() {
      this.shoppingList.push(["", []]);
    }
  },
  created() {
    if (this.user) {
      let shoppingList =
        this.user.shoppingList &&
        JSON.parse(JSON.stringify(this.user.shoppingList));
      if (shoppingList) {
        this.shoppingList = Object.entries(this.user.shoppingList);
      }
    }
  }
};
</script>
