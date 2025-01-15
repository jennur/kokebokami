<template>
  <div
    v-click-outside="event => closeDropdown(event)"
    role="listbox"
    tabindex="0"
    class="select"
    @click="open = !open"
    @keydown="
      event => {
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
        :class="
          `select_option ${
            selected.indexOf(option) > -1 ? 'select_option--selected' : ''
          }`
        "
        :key="`display-option-${index}`"
        @click="(event) => handleOption(event, option)"
        @keydown="
          event => {
            event.keyCode === 13 && handleOption(event, option);
          }
        "
      >{{ option }}</span>
    </div>
  </div>
</template>
<script>
 

export default {
  name: "multiple-select",
  data() {
    return {
      selected: [],
      open: false
    };
  },
  props: {
    id: {
      type: String,
      default: "select"
    },
    title: {
      type: String,
      default: ""
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleOption(event, option) {
      event.stopPropagation();
      let selectedIndex = this.selected.indexOf(option);
      if (selectedIndex > -1) this.selected.splice(selectedIndex, 1);
      else this.selected.push(option);
      this.$emit("select", this.selected);
    },
    closeDropdown(event) {
      this.open = false;
    }
  },
  
};
</script>
