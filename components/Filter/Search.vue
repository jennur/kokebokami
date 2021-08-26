<template>
  <label class="search-field">
      <input  id="search"
              type="text"
              placeholder="Search among recipes"
              @input="event => handleSearchTerm(event.target.value)"
      />
      <search-icon class="icon search-icon"/> 
  </label>
</template>

<script>
export default {
  name: "search",
  data() {
      return {
          open: false
      }
  },
  methods: {
    handleSearchTerm(value) {
      this.$emit("filterOnSearchTerm", value);
    }
  }
};
</script>
