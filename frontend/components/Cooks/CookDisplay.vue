<template>
  <nuxt-link
    :to="localePath(`/cooks/${cook.path}`)"
    class="following-cooks__cook"
  >
    <div
      role="img"
      v-if="!cook.hiddenProfile && cook.photoURL"
      class="following-cooks__img margin-right--xlarge"
      :style="`background-image: url(${cook.photoURL})`"
      :aria-label="(cook.hiddenProfile ? 'User' : cook.displayName) + '´s profile picture'"
    />
    <div
      v-else
      class="following-cooks__img flex-row flex-row--justify-center flex-row--align-center margin-right--xlarge"
    >
      <BackupImg />
    </div>
    <div class="flex-column">
      <h2 class="margin-bottom--small margin--none">
        {{ !cook.hiddenProfile && cook.displayName || "User" }}
      </h2>
      <p class="following-cooks__biography margin--none">
        {{ biography }}
      </p>
    </div>
  </nuxt-link>
</template>
<script>
import BackupImg from "~/assets/graphics/icons/cook-silhouette.svg";
export default {
  name: "cook-display",
  components: {
    BackupImg
  },
  props: {
    cook: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    biography(){
      if(!this.cook.hiddenProfile && this.cook.biography) {
        return this.cook.biography.substring(0, 70) + "..."
      }
      return this.$t("cooks.noBiography")
    }
  }
};
</script>
