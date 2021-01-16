<template>
  <main
    class="mobile-width padding-horizontal-lg margin-auto margin-bottom-2xl"
  >
    <div v-if="error.statusCode === 404" class="container container--center">
      <h1 class="margin-top-2xl">404 Whoops!</h1>
      <cracked-eggs class="illustration--cracked-eggs" />
      <h3>
        It looks like you're trying to access a page that does not exist, or
        that you don't have access to...
      </h3>
    </div>
    <div v-else class="container container--center">
      <h2>Whoopsie, something went wrong!</h2>
      <crackedEggs class="illustration--cracked-eggs" />
      <p>If the problem continues, please contact us.</p>
    </div>
    <div class="container container--center">
      <nuxt-link :to="localePath('/')"
        >Take me back to the front page</nuxt-link
      >
    </div>
  </main>
</template>

<script>
import crackedEggs from "~/assets/graphics/illustrations/cracked-eggs.svg";
export default {
  name: "error-page",
  components: {
    crackedEggs
  },
  head() {
    return {
      title: `${this.error.statusCode || 500} | Kokebokami`,
      meta: [
        {
          name: "robots" ,
          content: "noindex"
        }
      ]
    }
  },
  props: ["error"],
  layout: "default"
};
</script>
