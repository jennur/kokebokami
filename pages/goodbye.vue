<template>
  <div>
    <BreadCrumbs :routes="breadcrumbs" />

    <div class="flex-center-container flex-center-container--column">
      <h2 class="margin-bottom-lg">Goodbye</h2>
      <p>
        Your account was successfully deleted. You're welcome back at any time!
      </p>
      <NuxtLink :to="$localePath('/')">Back to home page</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const breadcrumbs = computed(() => {
  return [{ name: this.$t("navigation.home"), link: "/" }, { name: "Goodbye" }];
});

useHead({
  title: `Goodbye | Kokebokami`,
  meta: [
    {
      name: "robots",
      content: "noindex",
    },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://kokebokami.com/goodbye/",
    },
  ],
});
</script>
