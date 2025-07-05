<template>
  <section class="container">
    <h3 v-if="links.length" class="color--blue">
      {{ $t("recipes.categories") }}
    </h3>

    <category-accordion
      v-for="(category, index) in categories"
      :key="`category-${category.title}-${index}`"
      :open="() => accordionOpen(index)"
      :title="category.title"
      @add-link="() => addNewLink(index, category.title)"
      @toggle="() => toggleAccordion(index)"
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
          @update="emit('update')"
        />
      </div>
    </category-accordion>

    <div
      v-if="!links.length"
      class="container container--center margin-bottom-2xl"
    >
      {{ emptyListMessage }}
      <button
        class="button button--trans margin-top-2xl"
        @click="emit('open-form')"
      >
        Add recipe to this list
      </button>
    </div>
  </section>
</template>
<script setup>
import RecipeLink from "./Children/RecipeLink";
import CategoryAccordion from "~/components/RecipeLinkList/Children/CategoryAccordion";

const emit = defineEmits(["update", "open-form"]);

const props = defineProps({
  links: {
    type: Array,
    default: () => [],
  },
  hiddenCategories: {
    type: Array,
    default: () => [],
  },
  emptyListMessage: {
    type: String,
    default: "Looks like there is nothing here at the moment 😕",
  },
});

const addingNew = ref(false);
const addingToCategory = ref(null);
const openAccordions = ref([]);

const categories = computed(() => {
  let categories = [];

  props.links.forEach((link) => {
    if (link.category) {
      if (categories.indexOf(link.category) === -1)
        categories.push(link.category);
    } else categories.push("No category");
  });

  categories = categories.map((category) => {
    let linksInCategory = [];

    props.links.forEach((link) => {
      let hostName = link.url.split("/")[2];
      link.hostName = hostName.replace("www.", "");
      if (link.category === category) linksInCategory.push(link);
      if (category === "No category" && link.category === "")
        linksInCategory.push(link);
    });
    return {
      title: category,
      links: linksInCategory,
    };
  });
  categories.push(categories.shift());
  return categories.filter((category) => category);
});

function toggleAccordion(index) {
  const accordionIndex = openAccordions.value.indexOf(index);
  if (accordionIndex > -1) openAccordions.value.splice(accordionIndex, 1);
  else openAccordions.value.push(index);
}

function accordionOpen(index) {
  return openAccordions.value.indexOf(index) > -1;
}

function addNewLink(index, categoryTitle) {
  addingNew.value = true;
  addingToCategory.value = categoryTitle;
  const accordionIndex = openAccordions.value.indexOf(index);
  if (accordionIndex === -1) openAccordions.value.push(index);
}

function cancelNewLink() {
  setTimeout(() => {
    addingNew.value = false;
  }, 350);
}

function saveNewLink() {
  addingNew.value = false;
  emit("update");
}
</script>
