<template>
  <section class="container margin-vertical--xlarge">
    <h4 class="heading--blue margin-bottom--medium margin-left--small">Show categories</h4>
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
          @change="event => $emit('updateCategories', event)"
        />
        {{ category }}
      </label>
    </form>
  </section>
</template>

<script>
import userRecipeLinks from "~/mixins/userRecipeLinks.js";

export default {
  name: "link-categories-filter",
  props: {
    links: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    categories() {
      let links = this.links;
      let categories = ["No category"];
      links.forEach(link => {
        if (link[1].category) {
          if (categories.indexOf(link[1].category) === -1)
            categories.push(link[1].category);
        }
      });
      categories.push(categories.shift());
      return categories;
    }
  }
};
</script>
