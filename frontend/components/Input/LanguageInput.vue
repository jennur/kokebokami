<template>
  <fieldset class="categories">
    <h4 class="categories__title">Recipe language</h4>
    <select-component
      id="language"
      :options="languages"
      :preSelected="existingLanguage"
      defaultValue="All languages"
      @select="language => handleLanguage(language)"
    />
  </fieldset>
</template>
<script>
import SelectComponent from "./SelectComponent.vue";
export default {
  name: "language-input",
  components: {
    SelectComponent
  },
  /*data() {
    return { language: "" };
  },*/
  props: {
    existingLanguage: {
      type: String,
      default: ""
    }
  },
  computed: {
    languages() {
      let allCategoryObjects = this.$store.state.allCategories;
      return Object.values(
        allCategoryObjects.filter(object => {
          return object.languages;
        })[0]
      )[0];
    }
  },
  methods: {
    handleLanguage(language) {
      this.$emit("update", language);
    }
  },
  created() {
    if (this.existingLanguage !== "") this.language = this.existingLanguage;
  }
};
</script>
