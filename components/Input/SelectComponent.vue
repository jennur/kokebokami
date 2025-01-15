<template>
  <div
    v-click-outside="event => closeDropdown(event)"
    role="listbox"
    tabindex="0"
    class="select"
    :class="{'select--naked': naked}"
    @click="event => toggleDropdown(event)"
    @keydown="
      event => {
        event.keyCode === 13 && toggleDropdown(event)
      }
    "
  >
    <span class="select_selected">{{ selected }}</span>
    <div v-if="open" class="select_dropdown">
      <span
        v-if="defaultValue !== 'none'"
        tabindex="0"
        role="option"
        :aria-label="defaultValue"
        :aria-selected="selected === defaultValue"
        :class="
          `select_option ${
            selected === defaultValue ? 'select_option--selected' : ''
          }`
        "
        @click="(event) => handleOption(event, defaultValue)"
        @keydown="
          event => {
            event.keyCode === 13 && handleOption(event, defaultValue);
          }
        "
      >{{ defaultValue }}</span>
      <span
        tabindex="0"
        role="option"
        v-for="(option, index) in options"
        :aria-label="option"
        :aria-selected="selected === option"
        :class="
          `select_option ${
            selected === option ? 'select_option--selected' : ''
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
  name: "select-component",
  data() {
    return {
      selected: this.preSelected ? this.preSelected : this.defaultValue,
      open: false
    };
  },
  props: {
    id: {
      type: String,
      default: "select"
    },
    naked: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
    },
    defaultValue: {
      type: String,
      default: "Choose option"
    },
    preSelected: {
      type: String,
      default: null
    }
  },
  methods: {
    toggleDropdown(event) {
      event && event.stopPropagation();
      this.open = !this.open;
    },
    handleOption(event, option) {
      event && event.stopPropagation();
      this.selected = option;
      this.$emit("select", option);
      this.open = false;
    },
    closeDropdown(event) {
      this.open = false;
    }
  },
  
};
</script>
