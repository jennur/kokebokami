<template>
  <fieldset>
    <h4 class="margin-bottom--medium">Categories</h4>

    <label
      class="search-form__category margin-right--large"
      v-for="category in categories"
      :key="category"
    >
      <input
        type="checkbox"
        :id="category"
        :value="category"
        @change="
          event => {
            handleCategory(event.target);
          }
        "
      />
      {{ category }}
    </label>
  </fieldset>
</template>
<script>
export default {
  name: "categories",
  data() {
    return { checkedCategories: [] };
  },
  props: {
    existingCategories: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    allCategoryObjects() {
      return this.$store.getters.allCategories;
    },
    categories() {
      let allCategories = [];
      this.allCategoryObjects.forEach(categoryObj => {
        if (
          Object.keys(categoryObj)[0] === "typeOfMeal" ||
          Object.keys(categoryObj)[0] === "categories"
        )
          allCategories = allCategories.concat(Object.values(categoryObj)[0]);
      });
      return allCategories;
    }
  },
  methods: {
    handleCategory(target) {
      let checkedCategories = [].concat(this.checkedCategories);
      let categoryIndex = checkedCategories.indexOf(target.value);
      if (target.checked) {
        checkedCategories.push(target.value);
      } else if (!target.checked && categoryIndex !== -1) {
        checkedCategories.splice(categoryIndex, 1);
      }

      this.checkedCategories = checkedCategories;

      this.$emit("update", this.checkedCategories);
    }
  },
  mounted() {
    let existingCategories = this.existingCategories;
    if (existingCategories.length) {
      existingCategories.forEach(category => {
        let element = document.getElementById(category);
        if (element) element.checked = true;
      });
      this.checkedCategories = this.existingCategories;
    }
  }
};
</script>
