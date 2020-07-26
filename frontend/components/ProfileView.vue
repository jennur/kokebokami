<template>
  <div class="flex-row flex-row--align-center margin-bottom--xlarge">
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
      <h1>{{ user && user.displayName ? user.displayName : "" }}</h1>
      <p>{{ user && user.biography ? user.biography : "" }}</p>
    </div>
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
