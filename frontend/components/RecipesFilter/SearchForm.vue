<template>
  <fieldset>
    <label class="search-field">
      <search-icon class="search-icon" />
      <input
        id="search"
        type="text"
        placeholder="Search among recipes"
        @input="(event) =>{handleSearchTerm(event.target.value)}"
      />
    </label>
  </fieldset>
</template>
<script>
import CategoryFilter from "./CategoryFilter.vue";

export default {
  name: "search-form",
  components: {
    CategoryFilter
  },
  props: {
    recipes: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    categories() {
      return this.$store.getters.allCategories;
    }
  },

  methods: {
    handleSearchTerm(value) {
      this.$emit("filterSearchTerm", value);
    }
  }
};
</script>
