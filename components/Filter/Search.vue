<template>
    <label class="search-field" :class="{ open }" @click="openSearch">
        <search-icon class="icon search-icon"/>
        <input
            id="search"
            type="text"
            placeholder="Search among recipes"
            @input="event => handleSearchTerm(event.target.value)"
        />
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
    openSearch() {
        this.open = true;
    },
    handleSearchTerm(value) {
      this.$emit("filterOnSearchTerm", value);
    }
  }
};
</script>
