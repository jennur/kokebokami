<template>
  <div class="categories">
    <h4 class="categories__title margin-bottom--medium">Free from</h4>
    <label
      class="categories__category margin-right--large"
      v-for="allergen in allergens"
      :key="allergen"
    >
      <input
        type="checkbox"
        :value="allergen"
        :id="allergen"
        @change="
          event => {
            handlefreeFrom(event.target);
          }
        "
      />
      {{ allergen }}
    </label>
  </div>
</template>
<script>
export default {
  name: "free-from",
  data() {
    return { freeFrom: [] };
  },
  computed: {
    allergens() {
      let allCategoryObjects = this.$store.getters.allCategories;
      return Object.values(
        allCategoryObjects.filter(object => {
          return object.allergens;
        })[0]
      )[0];
    }
  },
  methods: {
    handlefreeFrom(target) {
      let categoryIndex = this.freeFrom.indexOf(target.value);
      let freeFrom = this.freeFrom;

      if (target.checked) {
        freeFrom.push(target.value);
      } else if (!target.checked && categoryIndex !== -1) {
        freeFrom.splice(categoryIndex, 1);
      }
      this.freeFrom = freeFrom;
      this.$emit("filter", this.freeFrom);
    }
  }
};
</script>
