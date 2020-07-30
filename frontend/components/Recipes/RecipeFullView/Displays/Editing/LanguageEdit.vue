<template>
  <div v-click-outside="closeEdit">
    <select-component
      id="language"
      :options="languages"
      :preSelected="language"
      defaultValue="All languages"
      @select="handleLanguage"
    />
  </div>
</template>
<script>
import ClickOutside from "vue-click-outside";
import SelectComponent from "~/components/Input/SelectComponent.vue";
export default {
  name: "language-edit",
  components: {
    SelectComponent
  },
  props: {
    language: {
      type: String,
      default: ""
    }
  },
  computed: {
    languages() {
      return this.$store.state.allCategories.languages;
    }
  },
  methods: {
    handleLanguage(language) {
      if (language === "All languages") {
        language = null;
      }
      this.$emit("update", language);
    },
    closeEdit() {
      this.$emit("close");
    }
  },
  directives: {
    ClickOutside
  }
};
</script>
