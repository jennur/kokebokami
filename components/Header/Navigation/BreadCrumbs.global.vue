<template>
  <div role="nav" class="breadcrumbs">
    <ul class="breadcrumbs_list">
      <li v-for="route in routes" :key="route.name">
        <span v-if="route.link">
          <NuxtLink :to="$localePath(route.link)">{{ route.name }}</NuxtLink>
          {{ " /" }}
        </span>
        <span class="active-link" v-else>{{ route.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  routes: {
    type: Array,
    default: () => [],
  },
});

const structuredData = () => {
  const listElements = props.routes
    .filter((route) => route.name !== "Home")
    .map((route, index) => {
      const crumbObject = {
        "@type": "ListItem",
        position: index + 1,
        name: route.name,
      };
      if (route.link)
        return {
          ...crumbObject,
          item: `https://kokebokami.com${route.link}`,
        };
      return crumbObject;
    });

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: listElements,
  });
};

useHead({
  script: [
    {
      type: "application/ld+json",
      json: structuredData(),
    },
  ],
});
</script>
