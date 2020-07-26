<template>
  <section class="preview-container container--center padding-vertical--xxxlarge">
    <h2 v-if="headline && !isMobile" class="color--blue margin-vertical--xxlarge">{{headline}}</h2>

    <div class="flex-row flex-row--align-center flex-row--justify-center">
      <div
        class="margin-horizontal--xlarge flex-column flex-column--align-center"
        :class="{
        'flex-order--two': flip && !isMobile,
        'flex-column': flipGraphic && !isMobile,
        }"
      >
        <h2 v-if="headline && isMobile" class="color--blue margin--none">{{headline}}</h2>

        <p
          v-if="description"
          class="preview__description margin-vertical--xlarge"
          :class="{
          'flex-order--two': flipGraphic && !isMobile
          }"
        >{{description}}</p>
        <client-only>
          <component
            v-if="!isMobile && illustration"
            :is="illustration"
            class="illustration illustration--preview-section"
            :class="{
        'flex-order--one': flipGraphic}"
          />
        </client-only>
      </div>
      <div
        class="preview__iphone margin-vertical--xlarge"
        :class="{
        'flex-order--one': flip && !isMobile
        }"
      >
        <video
          v-if="videoTitle"
          class="preview__iphone-video"
          :src="require(`~/assets/videos/${videoTitle}.mp4`)"
          autoplay
          muted
          loop
          playsinline
        />
        <img
          v-if="imageTitle"
          class="preview__iphone-video"
          :src="require(`~/assets/images/${imageTitle}.png`)"
          :alt="`${imageTitle}`"
        />
      </div>
    </div>
    <anchor-button :scrollTo="nextSection" />
  </section>
</template>

<script>
import AnchorButton from "~/components/AnchorButton.vue";

export default {
  name: "preview",
  components: {
    AnchorButton
  },
  props: {
    graphicTitle: {
      type: String,
      default: ""
    },
    videoTitle: {
      type: String,
      default: ""
    },
    imageTitle: {
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
    },
    flipGraphic: {
      type: Boolean,
      default: false
    },
    nextSection: {
      type: String,
      default: ""
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
