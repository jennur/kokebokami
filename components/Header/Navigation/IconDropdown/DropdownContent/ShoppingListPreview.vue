<template>
  <div class="content-dropdown_shopping-list-preview">
    <ul>
      <li v-for="listItem in listItems" :key="`listItem-${listItem.title}`">
        {{ listItem.title }}
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  listItems: {
    type: Array,
    default: () => [],
  },
});
</script>
