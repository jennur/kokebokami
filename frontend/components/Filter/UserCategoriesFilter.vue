<template>
  <section class="container margin-vertical--xlarge">
    <h4 class="heading--blue margin-bottom--medium margin-left-sm">Show categories</h4>
    <form class="link-categories-filter">
      <label
        class="form__input margin-right--medium"
        v-for="category in categories"
        :key="`category-${category}`"
      >
        <input
          type="checkbox"
          :value="category"
          checked
          @change="event => updateVisibleCategories(event)"
        />
        {{ category }}
      </label>
    </form>
  </section>
</template>

<script>
export default {
  name: "user-categories-filter",
  props: {
    categories: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return { hiddenCategories: [] };
  },
  methods: {
    updateVisibleCategories(event) {
      let hiddenCategories = this.hiddenCategories;
      let indexOfTargetValue = hiddenCategories.indexOf(event.target.value);
      if (indexOfTargetValue > -1) {
        hiddenCategories.splice(indexOfTargetValue, 1);
      } else {
        hiddenCategories.push(event.target.value);
      }
      this.$emit("updateCategories", hiddenCategories);
    }
  }
};
</script>
