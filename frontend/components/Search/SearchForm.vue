<template>
  <form class="search-form" v-on:submit.prevent>
    <fieldset>
      <label class="search-form__search-field">
        <searchIcon class="search-form__search-icon" />
        <input type="text" placeholder="Search among recipes" v-model="searchTerm" />
      </label>
    </fieldset>

    <fieldset>
      <h4 class="margin-bottom--medium">Categories</h4>

      <label
        class="search-form__category margin-right--large"
        v-for="category in categories"
        :key="category"
      >
        <input type="checkbox" :value="category" />
        {{category}}
      </label>
    </fieldset>
  </form>
</template>
<script>
import searchIcon from "~/assets/graphics/searchicon.svg";
export default {
  name: "search-form",
  components: {
    searchIcon
  },
  data() {
    return { searchTerm: "" };
  },
  props: {},
  computed: {
    categories() {
      return this.$store.getters.categories;
    }
  }
};
</script>
