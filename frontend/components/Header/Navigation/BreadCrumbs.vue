<template>
  <div role="nav" class="breadcrumbs">
    <ul class="breadcrumbs_list">
      <li v-for="route in routes" :key="route.name">
        <span v-if="route.link">
          <nuxt-link :to="localePath(route.link)">{{ route.name }}</nuxt-link>
          {{ " /" }}
        </span>
        <span class="active-link" v-else>{{ route.name }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "breadcrumbs",
  head() {
    let structuredData = this.structuredData;
    if (structuredData.itemListElement.length)
      return {
        script: [
          {
            type: "application/ld+json",
            json: structuredData
          }
        ]
      };
  },
  props: {
    routes: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    structuredData() {
      let listElements = this.routes
        .filter(route => route.name !== "Home")
        .map((route, index) => {
          let crumbObject = {
            "@type": "ListItem",
            position: index + 1,
            name: route.name
          };
          if (route.link)
            return {
              ...crumbObject,
              item: `https://kokebokami.com${route.link}`
            };
          return crumbObject;
        });

      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: listElements
      };
    }
  }
};
</script>
