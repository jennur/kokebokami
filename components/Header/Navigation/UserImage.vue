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

<script setup>
import BackupImg from "~/assets/graphics/icons/cook-silhouette-circle.svg";

const props = defineProps({
  photoURL: {
    type: String,
    default: ""
  },
  username: {
    type: String,
    default: "My account"
  }
});
</script>
