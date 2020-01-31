<template>
  <fieldset id="categories" class="categories-container">
    <div class="categories">
      <h4 class="categories__title margin-bottom--medium">Recipe Language</h4>
      <select
        class="categories__select"
        v-model="selected"
        @change="
          event => {
            handleCategory(event.target);
          }
        "
      >
        <option>All languages</option>
        <option
          v-for="category in languages"
          :value="category"
          :key="category"
          :id="category"
          >{{ category }}</option
        >
      </select>
    </div>
    <div class="categories">
      <h4 class="categories__title margin-bottom--medium">Type of meal</h4>
      <label
        class="categories__category margin-right--large"
        v-for="category in typeOfMeal"
        :key="category"
        :id="category"
      >
        <input
          type="checkbox"
          :value="category"
          @change="
            event => {
              handleCategory(event.target);
            }
          "
        />
        {{ category }}
      </label>
    </div>
    <div class="categories">
      <h4 class="categories__title margin-bottom--medium">Categories</h4>
      <label
        class="categories__category margin-right--large"
        v-for="category in mealCategories"
        :key="category"
        :id="category"
      >
        <input
          type="checkbox"
          :value="category"
          @change="
            event => {
              handleCategory(event.target);
            }
          "
        />
        {{ category }}
      </label>
    </div>
    <div class="categories">
      <h4 class="categories__title margin-bottom--medium">Free from</h4>
      <label
        class="categories__category margin-right--large"
        v-for="category in freeFrom"
        :key="category"
        :id="category"
      >
        <input
          type="checkbox"
          :value="category"
          @change="
            event => {
              handleCategory(event.target);
            }
          "
        />
        {{ category }}
      </label>
    </div>
  </fieldset>
</template>
<script>
export default {
  name: "category-filter",
  data() {
    return { selected: "", filteredCategories: [] };
  },
  props: {
    categories: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    allCategoryObjects() {
      return this.$store.getters.allCategories;
    },
    allCategories() {
      let allCategories = [];
      this.allCategoryObjects.forEach(categoryObj => {
        allCategories = allCategories.concat(Object.values(categoryObj)[0]);
      });

      return allCategories;
    },
    typeOfMeal() {
      return Object.values(
        this.allCategoryObjects.filter(object => {
          return object.typeOfMeal;
        })[0]
      )[0];
    },
    languages() {
      return Object.values(
        this.allCategoryObjects.filter(object => {
          return object.languages;
        })[0]
      )[0];
    },
    mealCategories() {
      return Object.values(
        this.allCategoryObjects.filter(object => {
          return object.categories;
        })[0]
      )[0];
    },
    freeFrom() {
      return Object.values(
        this.allCategoryObjects.filter(object => {
          return object.freeFrom;
        })[0]
      )[0];
    }
  },
  methods: {
    handleCategory(target) {
      let categoryIndex = this.filteredCategories.indexOf(target.value);
      let categories = this.filteredCategories;
      let language = this.selected;

      if (target.checked) {
        categories.push(target.value);
      } else if (
        target.value !== this.selected &&
        !target.checked &&
        categoryIndex !== -1
      ) {
        categories.splice(categoryIndex, 1);
      }
      this.filteredCategories = categories;
      console.log("CategoryObject::", {
        language: language,
        categories: this.filteredCategories
      });
      this.$emit("filterCategories", {
        language: language,
        categories: this.filteredCategories
      });
    }
  }
};
</script>
