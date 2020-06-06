<template>
  <div class="flex-row flex-row--align-center margin-vertical--xxlarge">
    <input
      class="recipe__servings margin-right--medium"
      type="Number"
      step="1"
      v-model="updatedServings"
      @change="handleChange"
    />
    <h4 class="margin--none margin-bottom--small">Servings</h4>
  </div>
</template>

<script>
export default {
  name: "servings-display",
  props: {
    servings: {
      type: String,
      default: ""
    }
  },
  data() {
    return { updatedServings: this.servings && parseInt(this.servings) };
  },
  methods: {
    handleChange() {
      this.$emit("updateServings", this.updatedServings);
    }
  }
};
</script>
