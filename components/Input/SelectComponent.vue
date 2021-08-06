<template>
  <div
    v-click-outside="event => closeDropdown(event)"
    role="listbox"
    tabindex="0"
    class="select"
    :class="{'select--naked': naked}"
    @click="open = !open"
    @keydown="
      event => {
        event.keyCode === 13 && (open = !open);
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
        @click="() => handleOption(defaultValue)"
        @keydown="
          event => {
            event.keyCode === 13 && handleOption(defaultValue);
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
        @click="() => handleOption(option)"
        @keydown="
          event => {
            event.keyCode === 13 && handleOption(option);
          }
        "
      >{{ option }}</span>
    </div>
  </div>
</template>
<script>
import ClickOutside from "vue-click-outside";

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
    handleOption(option) {
      this.selected = option;
      this.$emit("select", option);
    },
    closeDropdown(event) {
      this.open = false;
    }
  },
  directives: {
    ClickOutside
  }
};
</script>
