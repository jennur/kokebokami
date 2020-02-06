<template>
  <fieldset class="categories">
    <h4 class="categories__title">Recipe language</h4>
    <select v-model="language" @change="handleLanguage" id="language" class="categories__select">
      <option>All languages</option>
      <option
        v-for="language in languages"
        :value="language"
        :key="language"
        :id="language"
      >{{ language }}</option>
    </select>
  </fieldset>
</template>
<script>
export default {
  name: "language-input",
  data() {
    return { language: "" };
  },
  props: {
    existingLanguage: {
      type: String,
      default: ""
    }
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
      this.$emit("update", this.language);
    }
  },
  created() {
    if (this.existingLanguage !== "") this.language = this.existingLanguage;
  }
};
</script>
