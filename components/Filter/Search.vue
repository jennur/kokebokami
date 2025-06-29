<template>
  <label :class="['search-field', open && 'focus']" @click="handleFocus">
    <input
      id="search"
      type="text"
      :placeholder="$t('searchPlaceholder')"
      @input="(event) => handleSearchTerm(event.target.value)"
      tabindex="0"
      @focus="handleFocus"
    />
    <i-search-icon
      @click="open = !open"
      @keydown="(event) => event.keyCode === 13 && (open = !open)"
      class="search-icon"
      title="Search"
    />
  </label>
</template>

<script setup>
const emit = defineEmits(["filterOnSearchTerm"]);
const open = ref(false);

function handleSearchTerm(value) {
  emit("filterOnSearchTerm", value);
}

function handleFocus() {
  open.value = true;
}
</script>
