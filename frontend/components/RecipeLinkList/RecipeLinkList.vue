<template>
  <section class="container">
    <h3 v-if="links.length" class="color--blue">{{ $t("recipes.categories") }}</h3>

    <category-accordion v-for="(category, index) in categories"
                        :key="`category-${category.title}-${index}`"
                        :open="accordionOpen(index)"
                        :title="category.title"
                        @add-link="addNewLink(index, category.title)"
                        @toggle="toggleAccordion(index)"
    >
      <div v-if="category && category.links" class="recipe-link-list">
        <recipe-link
          v-if="addingNew && addingToCategory === category.title"
          :link="{}"
          :addingToCategory="addingToCategory"
          @update="saveNewLink"
          @cancel="cancelNewLink"
        />
        <recipe-link
          v-for="(link, index) in category.links"
          :key="`recipe-link-${index}`"
          :link="link"
          @update="$emit('update')"
        />
      </div>
    </category-accordion>

    <div v-if="!links.length" class="container container--center margin-bottom--xxlarge">
      {{ emptyListMessage }}
      <button class="button button--transparent margin-top--xxlarge" @click="$emit('open-form')">
        Add recipe to this list
      </button>
    </div>
  </section>
</template>
<script>
import RecipeLink from "./Children/RecipeLink";
import CategoryAccordion from "~/components/RecipeLinkList/Children/CategoryAccordion";

export default {
  name: "recipes-link-list",
  components: {
    CategoryAccordion,
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
  data() {
    return {
      addingNew: false,
      addingToCategory: null,
      openAccordions: []
    };
  },
  computed: {
    categories() {
      let links = this.links;
      let categories = [];
      links.forEach(link => {
        if (link.category) {
          if (categories.indexOf(link.category) === -1)
            categories.push(link.category);
        } else categories.push("No category");
      });
      categories = categories.map(category => {
        let linksInCategory = [];
        links.forEach(link => {
          let hostName = link.url.split("/")[2];
          link.hostName = hostName.replace("www.", "");
          if (link.category === category) linksInCategory.push(link);
          if (category === "No category" && link.category === "")
            linksInCategory.push(link);
        });
        return {
          title: category,
          links: linksInCategory
        };
      });
      categories.push(categories.shift());
      return categories.filter(category => category);
    }
  },
  methods: {
    toggleAccordion(index) {
      let openAccordions = this.openAccordions;
      let accordionIndex = openAccordions.indexOf(index);
      if (accordionIndex > -1) this.openAccordions.splice(accordionIndex, 1);
      else this.openAccordions.push(index);
    },
    accordionOpen(index) {
      return this.openAccordions.indexOf(index) > -1;
    },
    addNewLink(index, categoryTitle) {
      this.addingNew = true;
      this.addingToCategory = categoryTitle;
      let openAccordions = this.openAccordions;
      let accordionIndex = openAccordions.indexOf(index);
      if (accordionIndex === -1) this.openAccordions.push(index);
    },
    cancelNewLink() {
      setTimeout(() => {
        this.addingNew = false;
      }, 350);
    },
    saveNewLink() {
      this.addingNew = false;
      this.$emit("update");
    }
  }
};
</script>
