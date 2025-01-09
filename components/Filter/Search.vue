<template>
  <label :class="['search-field', open && 'focus']" @click="handleFocus">
      <input  id="search"
              type="text"
              :placeholder="$t('searchPlaceholder')"
              @input="event => handleSearchTerm(event.target.value)"
              tabindex="0"
              @focus="handleFocus"
      />
      <fa   :icon="['fas', 'search']"
            class="search-icon"
            @click="open = !open"
            @keydown="event => event.keyCode === 13 && (open = !open)"
            title="Search"
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
    handleSearchTerm(value) {
      this.$emit("filterOnSearchTerm", value);
    },
    handleFocus() {
      this.open = true;
    }
  }
};
</script>
