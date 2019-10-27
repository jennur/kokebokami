<template>
  <div class="breadcrumbs">
    <ul class="breadcrumbs__list">
      <li v-for="route in routes" :key="route.link">
        <nuxt-link :to="route.link">{{route.name}}</nuxt-link>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "breadcrumbs",
  props: {
    routes: {
      type: Array,
      default: () => []
    }
  }
};
</script>
