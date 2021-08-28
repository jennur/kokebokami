<template>
  <div class="servings">
    <input type="number" min="0" step="1" v-model="updatedServings" /><button
      class="button button--dynamic-small button--round padding-v-sm margin-h-lg"
      @click="event => handleClick(event)"
    >
      Save
    </button>
  </div>
</template>

<script>
export default {
  name: "servings-edit",
  props: {
    servings: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      updatedServings: this.servings
    };
  },
  methods: {
    handleClick(event) {
      event && event.stopPropagation();
      this.$emit('save', this.updatedServings)
    }
  }
};
</script>
