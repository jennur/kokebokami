<template>
  <fieldset id="freeFrom" class="categories">
    <h4 class="categories__title margin-bottom--medium">Free from</h4>

    <label
      class="categories__category margin-right--large"
      v-for="allergen in allergens"
      :key="allergen"
    >
      <input
        type="checkbox"
        :id="allergen"
        :value="allergen"
        @change="
          event => {
            handleFreeFrom(event.target);
          }
        "
      />
      {{ allergen }}
    </label>
  </fieldset>
</template>
<script>
export default {
  name: "free-from-input",
  data() {
    return { checkedFreeFrom: [] };
  },
  props: {
    existingFreeFrom: {
      type: Array,
      default: () => []
    }
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
    handleFreeFrom(target) {
      let categoryIndex = this.checkedFreeFrom.indexOf(target.value);
      let freeFrom = [].concat(this.checkedFreeFrom);

      if (target.checked) {
        freeFrom.push(target.value);
      } else if (!target.checked && categoryIndex !== -1) {
        freeFrom.splice(categoryIndex, 1);
      }
      this.checkedFreeFrom = freeFrom;
      this.$emit("update", this.checkedFreeFrom);
    }
  },
  mounted() {
    let existingFreeFrom = this.existingFreeFrom;

    if (existingFreeFrom && existingFreeFrom.length) {
      existingFreeFrom.forEach(allergen => {
        let element = document.getElementById(allergen);
        if (element) element.checked = true;
      });
    }
    this.checkedFreeFrom = this.existingFreeFrom;
  }
};
</script>
