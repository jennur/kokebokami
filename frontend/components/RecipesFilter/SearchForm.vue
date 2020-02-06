<template>
  <fieldset>
    <label class="search-field">
      <search-icon class="search-icon" />
      <input
        id="search"
        type="text"
        placeholder="Search among recipes"
        @input="
          event => {
            handleSearchTerm(event.target.value);
          }
        "
      />
    </label>
  </fieldset>
</template>
<script>
export default {
  name: "search-form",
  methods: {
    handleSearchTerm(value) {
      this.$emit("filterOnSearchTerm", value);
    }
  }
};
</script>
