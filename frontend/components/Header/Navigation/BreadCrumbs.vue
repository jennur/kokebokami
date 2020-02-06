<template>
  <div role="nav" class="breadcrumbs">
    <ul class="breadcrumbs__list">
      <li v-for="route in routes" :key="route.name">
        <span v-if="route.link">
          <nuxt-link :to="route.link">{{route.name}}</nuxt-link>
          {{" /"}}
        </span>
        <span class="active-link" v-else>{{route.name}}</span>
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
