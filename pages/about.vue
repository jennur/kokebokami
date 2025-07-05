<template>
  <section>
    <BreadCrumbs :routes="breadcrumbs" />

    <foodclouds class="illustration illustration--food-clouds" />

    <div class="mobile-width margin-auto">
      <h2>Make your cookbook go cloudy</h2>
      <p>
        «Kokeboka mi» is Norwegian and means «my cookbook». There is something
        special about storing your personal recipes in some personal space only
        available to you - recipes that you know by heart and want to pass on to
        your loved ones.
        <br />
        <br />In Norway, nothing is as special as grandmas «kjøttkaker», but
        even though there are tons of recipes for kjøttkaker out there,
        grandma's recipe is always the one and only.
        <br />
        <br />Kokebokami was created for those who want to save and access their
        handwritten recipes easily, without the struggle of searching to find
        the beloved book that the recipes were written into. It was also created
        for those who are tired of always forgetting where they saved the recipe
        they wanted to try.
        <br />
        <br />Keep all your recipes, whether you found them in a book or online,
        in a place where only you have access, and have the option of sharing
        them with the world.
        <br />
        <br />
      </p>
      <h4>Happy storing in kokeboka di 🧡</h4>
    </div>
    <clouds class="illustration illustration--clouds" />
  </section>
</template>

<script setup>
import foodclouds from "../assets/graphics/illustrations/cookbook-clouds.svg";
import clouds from "../assets/graphics/illustrations/clouds.svg";

const { t } = useI18n();

useHead({
  title: `About | Kokebokami`,
  link: [
    {
      rel: "canonical",
      href: "https://kokebokami.com/about/",
    },
  ],
});

const breadcrumbs = computed(() => {
  return [
    { name: t("navigation.home"), link: "/" },
    { name: t("navigation.about") },
  ];
});
</script>

<style lang="scss">
.illustration {
  animation: bouncing infinite;
  animation-duration: 10s;
}

@keyframes bouncing {
  0%,
  100% {
    -moz-transform: translateY(-0.5rem);
    -webkit-transform: translateY(-0.5rem);
    -o-transform: translateY(-0.5rem);
    -ms-transform: translateY(-0.5rem);
    transform: translateY(-0.5rem);
  }

  50% {
    -moz-transform: translateY(0.5rem);
    -webkit-transform: translateY(0.5rem);
    -o-transform: translateY(0.5rem);
    -ms-transform: translateY(0.5rem);
    transform: translateY(0.5rem);
  }
}
</style>
