<template>
  <div class="profile margin-bottom--xxlarge">
    <div
      class="flex-row flex-row--align-center flex-row--nowrap margin-bottom--xlarge"
    >
      <div
        v-if="user && user.photoURL"
        role="img"
        class="profile__img margin-right--xlarge"
        :style="`background-image: url(${user.photoURL});`"
        :aria-label="user.displayName + '´s profile picture'"
      />
      <div v-else class="profile__img--backup margin-right--xlarge">
        <backupImg />
      </div>
      <div class="profile__biography mobile-width">
        <h1 class="margin--none">
          {{ user && user.displayName ? user.displayName : "User" }}
        </h1>
        <p
          v-if="user && user.biography"
          class="hidden-mobile margin-top--large"
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
