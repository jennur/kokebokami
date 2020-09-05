<template>
  <section>
    <breadcrumbs :routes="breadcrumbs" />

    <foodclouds class="illustration illustration--food-clouds" />

    <div class="mobile-width margin--auto">
      <h2>Make your cookbook go cloudy</h2>
      <p>
        «Kokeboka mi» is Norwegian and means «my cookbook». There is something
        special about storing your personal recipes in some personal space only
        available to you - recipes that you know by heart and want to pass on to
        your loved ones.
        <br />
        <br />In Norway, nothing is as special as grandmas «kjøttkaker» (meat
        cakes), but even though there are tons of recipes for kjøttkaker out
        there, grandma's recipe is always the one and only. Kokebokami was
        created for those who want to save and access their handwritten recipes
        easily, without the struggle of searching to find the beloved book that
        the recipes were written into. Keep your recipes in a place where only
        you have access, and have the option of sharing them with the world.
        <br />
        <br />
      </p>
      <h4>Happy storing in kokeboka di 🧡</h4>
    </div>
    <clouds class="illustration illustration--clouds" />
    <!-- <preview
        id="addRecipe"
        headline="Collect your favorite recipes in one place"
        description="Add your personal recipes, or save recipes from anywhere on the web to make sure you don't forget about their existence."
        videoTitle="add-recipe"
        graphicTitle="favorite-cloud"
        :flipGraphic="true"
        nextSection="accessRecipes"
        class="container--light-blue padding-horizontal--medium"
      />
      <preview
        id="accessRecipes"
        headline="Access your recipes wherever you are"
        description="No more searching for your old cookbook or looking around the internet for that recipe you wanted to try. Store them all in one place to access them right away."
        videoTitle="access-recipes"
        graphicTitle="market"
        :flip="true"
        nextSection="changeServings"
        class="container--green padding-horizontal--medium"
      />
      <preview
        id="changeServings"
        headline="Adjust servings to the amount you need"
        description="Don't worry about calculating the amount you need for x servings. Just give us the number."
        videoTitle="change-servings"
        nextSection="addToShoppingList"
        class="container--light-blue padding-horizontal--medium"
      />

      <preview
        id="addToShoppingList"
        headline="Plan and organize your shopping"
        description="With the shopping planner you can easily plan for big events or simply the rest of the week."
        imageTitle="shopping-list"
        :flip="true"
        nextSection="signUp"
        class="container--green padding-horizontal--medium"
    />-->
  </section>
</template>
<script>
import foodclouds from "../assets/graphics/illustrations/cookbook-clouds.svg";
import clouds from "../assets/graphics/illustrations/clouds.svg";
export default {
  name: "about",
  head() {
    return {
      title: `About | Kokebokami`,
      link: [
        {
          rel: "canonical",
          href: "https://www.kokebokami.com/about/",
        },
      ],
    };
  },
  components: {
    foodclouds,
    clouds,
  },
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [{ name: "Home", link: "/" }, { name: "About" }],
    },
  },
};
</script>

<style lang="scss">
#leftCloud {
  animation: passingCloud infinite;
  animation-duration: 10s;
}
#right-cloud {
  animation: passingCloud infinite;
  animation-duration: 7s;
}
#middle-cloud {
  animation: passingCloud infinite;
  animation-duration: 5s;
}

@keyframes passingCloud {
  0%,
  100% {
    -moz-transform: translate(0px, 0px);
    -webkit-transform: translate(0px, 0px);
    -o-transform: translate(0px, 0px);
    -ms-transform: translate(0px, 0px);
    transform: translate(0px, 0px);
  }

  50% {
    -moz-transform: translate(0px, -20px);
    -webkit-transform: translate(0px, -20px);
    -o-transform: translate(0px, -20px);
    -ms-transform: translate(0px, -20px);
    transform: translate(0px, -20px);
  }
}
</style>
