<template>
  <form class="search-form" v-on:submit.prevent>
    <fieldset>
      <label class="search-form__search-field">
        <search-icon class="search-form__search-icon" />
        <input
          id="search"
          type="text"
          placeholder="Search among recipes"
          @input="(event) =>{handleSearchTerm(event.target.value)}"
        />
      </label>
    </fieldset>

    <fieldset id="categories">
      <h4 class="margin-bottom--medium">Categories</h4>

      <label
        class="search-form__category margin-right--large"
        v-for="category in categories"
        :key="category"
        :id="category"
      >
        <input type="checkbox" :value="category" @change="(event) =>{handleCategory(event.target)}" />
        {{category}}
      </label>
    </fieldset>
  </form>
</template>
<script>
export default {
  name: "search-form",
  props: {},
  computed: {
    categories() {
      return this.$store.getters.categories;
    }
  },
  methods: {
    handleSearchTerm(value) {
      this.$emit("filterBySearchTerm", value);
    },
    handleCategory(target) {
      this.$emit("filterByCategory", target);
    }
  }
};
</script>
