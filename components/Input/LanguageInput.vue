<template>
  <fieldset class="language-input">
    <select-component
      id="language"
      :naked="naked"
      :options="languages"
      :preSelected="existingLanguage"
      defaultValue="All languages"
      @select="language => $emit('selected', language)"
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
  props: {
    existingLanguage: {
      type: String,
      default: ""
    },
    naked: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    languages() {
      return this.$store.state.allCategories.languages;
    }
  }
};
</script>
