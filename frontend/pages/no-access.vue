<template>
  <main
    class="mobile-width padding-horizontal--large margin--auto margin-bottom--xxlarge"
  >
    <div class="container container--center">
      <h1 class="margin-top--xxlarge">Oh no!</h1>
      <cracked-eggs class="illustration--cracked-eggs" />
      <h3>
        It looks like you don't have access to this recipe.
      </h3>
    </div>
    <div class="container container--center">
      <nuxt-link :to="localePath('/')">Discover public recipes</nuxt-link>
    </div>
  </main>
</template>

<script>
import crackedEggs from "~/assets/graphics/illustrations/cracked-eggs.svg";
export default {
  name: "no-access",
  head() {
    return {
      link: [
        {
          rel: "canonical",
          href: "https://kokebokami.com/no-access/"
        }
      ]
    };
  },
  components: {
    crackedEggs
  },
  layout: "default"
};
</script>
