<template>
  <div class="categories">
    <h4 class="categories__title margin-bottom--medium">Recipe Language</h4>
    <select
      class="categories__select"
      v-model="selected"
      @change="handleLanguage"
    >
      <option>All languages</option>
      <option
        v-for="language in languages"
        :value="language"
        :key="language"
        :id="language"
        >{{ language }}</option
      >
    </select>
  </div>
</template>
<script>
export default {
  name: "language",
  data() {
    return { selected: "" };
  },
  computed: {
    languages() {
      let allCategoryObjects = this.$store.getters.allCategories;
      return Object.values(
        allCategoryObjects.filter(object => {
          return object.languages;
        })[0]
      )[0];
    }
  },
  methods: {
    handleLanguage() {
      this.$emit("filter", this.selected);
    }
  }
};
</script>
