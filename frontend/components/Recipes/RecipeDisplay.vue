<template>
  <nuxt-link :to="`/recipes/${recipeUrl}/`" class="recipe-display">
    <!-- Image -->
    <div :style="`background-image: url(${recipeImage})`" class="recipe-display__image"></div>

    <span class="recipe-display__published-by" v-if="inPublicList">Published by {{ recipeOwner }}</span>
    <span class="recipe-display__public-note" v-if="showPublicNote">Public</span>
    <div class="full-width padding--xlarge">
      <!-- Details -->

      <div class="recipe-display__category-note">
        <p v-if="typeOfMeal">
          <b>Meal type:</b>
          {{ typeOfMeal }}
        </p>
        <p v-if="freeFrom">
          <b>Free from:</b>
          {{ freeFrom }}
        </p>
      </div>

      <!-- Description -->
      <h3
        class="recipe-display__title margin--none margin-bottom--medium"
      >{{ recipe.title ? recipe.title : "Recipe has no title" }}</h3>
      <div class="recipe-display__description margin-bottom--large">
        {{
        recipe.description ? recipe.description : "Recipe has no description"
        }}
      </div>
    </div>
    <!-- Categories -->
    <div>
      <div class="recipe-display__categories">
        <span
          class="recipe-display__category margin-bottom--xxlarge margin-horizontal--small"
          v-for="category in categories"
          :key="category"
        >{{ category }}</span>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
import recipeBackupImg from "~/assets/graphics/icons/recipe-backup-img.svg";
import user from "~/mixins/user.js";

export default {
  name: "recipe-display",
  components: {
    recipeBackupImg,
  },
  props: {
    recipe: {
      type: Object,
      default: () => {},
    },
    recipeID: {
      type: String,
      default: "",
    },
    inPublicList: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      recipeOwner: "Unknown",
    };
  },
  mixins: [user],
  computed: {
    showPublicNote() {
      return (
        !this.inPublicList &&
        this.user &&
        this.user.id === this.recipe.ownerID &&
        this.recipe.public
      );
    },
    recipeImage() {
      let photoURL = this.recipe.photoURL;
      return photoURL
        ? photoURL
        : require("~/assets/graphics/icons/recipe-backup-img.png");
    },
    recipeUrl() {
      return this.recipeID;
    },
    categories() {
      let categories = this.recipe.categories;
      return categories && Object.values(categories);
    },
    typeOfMeal() {
      let typeOfMeal = [];
      if (this.recipe && this.recipe.typeOfMeal) {
        this.recipe.typeOfMeal.forEach((type) => {
          type = type.charAt(0).toUpperCase() + type.slice(1);
          typeOfMeal.push(type);
        });
      }
      return typeOfMeal.join(", ");
    },
    freeFrom() {
      let freeFrom = [];
      if (this.recipe && this.recipe.freeFrom) {
        this.recipe.freeFrom.forEach((allergen) => {
          allergen = allergen.charAt(0).toUpperCase() + allergen.slice(1);
          freeFrom.push(allergen);
        });
      }
      return freeFrom.join(", ");
    },
  },
  methods: {
    getRecipeOwner() {
      let displayNameRef = this.$fireDb.ref(
        `users/${this.recipe.ownerID}/displayName`
      );
      displayNameRef.once("value", (snapshot) => {
        if (snapshot.exists()) this.recipeOwner = snapshot.val();
      });
    },
  },
  mounted() {
    this.getRecipeOwner();
  },
};
</script>
