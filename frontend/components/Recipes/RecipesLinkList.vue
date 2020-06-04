<template>
  <section class="container">
    <div v-for="category in categories" :key="`category-${category.title}`">
      <div
        v-if="
          hiddenCategories.indexOf(category.title) === -1 &&
            category.links.length
        "
      >
        <h4
          class="recipe-link-list__headline margin-bottom--medium margin-left--small"
        >
          {{ category && category.title }}
        </h4>
        <div class="recipe-link-list">
          <recipe-link
            v-for="(link, index) in category.links"
            :key="`recipe-link-${index}`"
            :link="link"
          />
        </div>
      </div>
    </div>
    <div
      v-if="!links.length"
      class="container container--center margin-bottom--xxlarge"
    >
      {{ emptyListMessage }}
      <button
        class="button button--transparent margin-top--xxlarge"
        @click="$emit('openForm')"
      >
        Add recipe to this list
      </button>
    </div>
  </section>
</template>
<script>
import RecipeLink from "./RecipeLink";
export default {
  name: "recipes-link-list",
  components: {
    RecipeLink
  },
  props: {
    links: {
      type: Array,
      default: () => []
    },
    hiddenCategories: {
      type: Array,
      default: () => []
    },
    emptyListMessage: {
      type: String,
      default: "Looks like there is nothing here at the moment 😕"
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
      categories = categories.map(category => {
        let linksInCategory = [];
        links.forEach(link => {
          let hostName = link[1].url.split("/")[2];
          link[1].hostName = hostName.replace("www.", "");
          if (link[1].category === category) linksInCategory.push(link);
          if (category === "No category" && link[1].category === "")
            linksInCategory.push(link);
        });
        return {
          title: category,
          links: linksInCategory
        };
      });
      categories.push(categories.shift());
      return categories;
    }
  }
};
</script>
