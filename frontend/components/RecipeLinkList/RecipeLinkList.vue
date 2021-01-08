<template>
  <section class="container">
    <h3 v-if="links.length" class="color--blue">{{ $t("recipes.categories") }}</h3>
    <div
      class="accordion"
      v-for="(category, index) in categories"
      :key="`category-${category && category.title}-${index}`"
    >
      <div>
        <div
          class="accordion__tab margin-bottom--medium"
          @click="toggleAccordion(index)"
        >
          <span class="recipe-link-list__headline margin--none">
            <downArrow
              v-if="accordionOpen(index)"
              class="icon icon--small margin-right--medium"
            />
            <rightArrow v-else class="icon icon--small margin-right--medium" />
            {{ category && category.title }}
          </span>
          <button
            class="button--increment button--increment-small margin-left--medium"
            @click="event => addNewLink(event, index, category.title)"
          >
            Add link
          </button>
        </div>
        <expand-transition :show="accordionOpen(index)">
          <div v-if="category && category.links" class="recipe-link-list">
            <recipe-link
              v-if="addingNew && addingToCategory === category.title"
              :key="`recipe-link-new`"
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
        </expand-transition>
      </div>
    </div>
    <div
      v-if="!links.length"
      class="container container--center margin-bottom--xxlarge"
    >
      {{ emptyListMessage }}
      <button
        class="button button--transparent margin-top--xxlarge"
        @click="$emit('open-form')"
      >
        Add recipe to this list
      </button>
    </div>
  </section>
</template>
<script>
import RecipeLink from "./Children/RecipeLink";
import ExpandTransition from "~/components/Transitions/Expand.vue";
import rightArrow from "assets/graphics/icons/right-arrow.svg";
import downArrow from "assets/graphics/icons/down-arrow.svg";

export default {
  name: "recipes-link-list",
  components: {
    RecipeLink,
    ExpandTransition,
    rightArrow,
    downArrow
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
    addNewLink(event, index, categoryTitle) {
      event && event.stopPropagation();
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
