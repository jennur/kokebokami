<template>
  <div class="profile margin-bottom-2xl">
    <div
      class="flex-row flex-row--align-center flex-row--nowrap margin-bottom-xl"
    >
      <div
        v-if="user && user.photoURL"
        role="img"
        class="profile_img margin-right-xl"
        :style="`background-image: url(${user.photoURL});`"
        :aria-label="user.displayName + '´s profile picture'"
      />
      <div v-else class="profile_img--backup margin-right-xl">
        <backupImg />
      </div>
      <div class="profile_biography mobile-width">
        <h1 class="margin--none">
          {{ user && user.displayName ? user.displayName : "User" }}
        </h1>
        <p
          v-if="user && user.biography"
          class="hidden-mobile margin-top-lg"
        >
          {{ user.biography }}
        </p>
      </div>
    </div>
    <p v-if="user && user.biography" class="visible-mobile">
      {{ user.biography }}
    </p>
  </div>
</template>
<script>
import backupImg from "~/assets/graphics/icons/cook-silhouette-circle.svg";

export default {
  name: "profile-view",
  components: {
    backupImg
  },
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
