<template>
  <div class="user-image">
    <img
      v-if="photoURL"
      class="google-profile-picture"
      :src="photoURL"
      :alt="`${username} profile picture`"
    />
    <span v-else class="google-profile-picture--backup">
      <BackupImg />
    </span>
  </div>
</template>
<script>
import BackupImg from "~/assets/graphics/cook-silhouette-circle.svg";

export default {
  name: "user-image",
  components: {
    BackupImg
  },
  props: {
    photoURL: {
      type: String,
      default: ""
    },
    username: {
      type: String,
      default: "My account"
    }
  }
};
</script>
