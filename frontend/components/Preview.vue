<template>
  <section class="preview-container container--center padding-vertical--xxlarge">
    <!--     <h2 class="color--blue margin-vertical--xxlarge">Find your recipes wherever you are</h2>
    -->
    <h2 class="color--blue margin-top--large">Look up your recipes wherever you are</h2>
    <div
      class="flex-row flex-row--nowrap flex-row--align-center flex-row--justify-center margin-top--xxlarge padding-vertical--xxlarge"
    >
      <div class="preview__iphone">
        <video
          class="preview__iphone-video"
          src="~assets/videos/my-kokebok_preview.mp4"
          autoplay="true"
          muted="true"
          loop="true"
        />
      </div>
      <client-only>
        <guyInMarket v-if="!isMobile" class="illustration illustration--guy-in-market" />
      </client-only>
    </div>
  </section>
</template>

<script>
import guyInMarket from "~/assets/graphics/market.svg";

export default {
  name: "preview",
  components: {
    guyInMarket
  },
  computed: {
    isMobile() {
      if (process.browser) return window.innerWidth < 600;
    }
  }
};
</script>
