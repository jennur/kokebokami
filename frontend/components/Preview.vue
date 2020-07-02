<template>
  <section class="preview-container container--center padding-vertical--xxlarge">
    <h2 v-if="headline" class="color--blue margin-top--large">{{headline}}</h2>
    <div
      class="flex-row flex-row--nowrap flex-row--align-center flex-row--justify-center margin-top--xxlarge padding-vertical--xxlarge"
    >
      <div class="preview__iphone" :class="{
        'flex-order--two': flip}">
        <video
          v-if="videoTitle"
          class="preview__iphone-video"
          :src="require(`~/assets/videos/${videoTitle}.mp4`)"
          autoplay
          muted
          loop
          playsinline
        />
      </div>
      <div
        :class="{
        'flex-order--one margin-right--xxlarge': flip,
        'margin-left--xxlarge' : !flip}"
      >
        <p class="preview__description margin-bottom--xxlarge">{{description}}</p>
        <client-only>
          <component
            v-if="!isMobile && illustration"
            :is="illustration"
            class="illustration illustration--preview-section"
          />
        </client-only>
      </div>
    </div>
  </section>
</template>

<script>
import market from "~/assets/graphics/illustrations/market.svg";

export default {
  name: "preview",
  props: {
    graphicTitle: {
      type: String,
      default: ""
    },
    videoTitle: {
      type: String,
      default: ""
    },
    headline: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    flip: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      illustration: null
    };
  },
  computed: {
    isMobile() {
      if (process.browser) return window.innerWidth < 600;
    }
  },
  created() {
    if (this.graphicTitle) {
      this.illustration = () =>
        import(`../assets/graphics/illustrations/${this.graphicTitle}.svg`);
    }
  }
};
</script>
