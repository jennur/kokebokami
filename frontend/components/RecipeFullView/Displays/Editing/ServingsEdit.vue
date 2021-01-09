<template>
  <div class="servings">
    <input type="number" min="0" step="1" v-model="updatedServings" /><button
      class="button button--dynamic-small button--round padding-vertical-sm margin-horizontal--large"
      @click="$emit('save', updatedServings)"
    >
      Save default value
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
  }
};
</script>
