<template>
  <div class="tablet-width padding-horizontal--large margin--auto">
    <div v-if="error.statusCode === 404">
      <h1>404 Whoops!</h1>
      <h3>It looks like you're trying to access a page that does not exist, or that you don't have access to...</h3>
    </div>
    <h2 v-else>An error occurred</h2>
    <nuxt-link to="/">Take me back to the front page</nuxt-link>
  </div>
</template>

<script>
export default {
  props: ["error"],
  layout: "default"
};
</script>
