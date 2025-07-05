<template>
  <div
    v-click-outside="(event) => closeDropdown(event)"
    role="listbox"
    tabindex="0"
    class="select"
    @click="open = !open"
    @keydown="
      (event) => {
        event.keyCode === 13 && (open = !open);
      }
    "
  >
    <span class="select_selected">{{ title }}</span>
    <div v-if="open" class="select_dropdown">
      <span
        tabindex="0"
        role="option"
        v-for="(option, index) in options"
        :aria-label="option"
        :aria-selected="selected.indexOf(option) > -1"
        :class="`select_option ${
          selected.indexOf(option) > -1 ? 'select_option--selected' : ''
        }`"
        :key="`display-option-${index}`"
        @click="(event) => handleOption(event, option)"
        @keydown="
          (event) => {
            event.keyCode === 13 && handleOption(event, option);
          }
        "
        >{{ option }}</span
      >
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["select"]);
const props = defineProps({
  id: {
    type: String,
    default: "select",
  },
  title: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    default: () => [],
  },
});

const selected = ref([]);
const open = ref(false);

function handleOption(event, option) {
  event.stopPropagation();
  const selectedIndex = selected.value.indexOf(option);
  if (selectedIndex > -1) selected.value.splice(selectedIndex, 1);
  else selected.value.push(option);
  emit("select", selected.value);
}

function closeDropdown() {
  open.value = false;
}
</script>
