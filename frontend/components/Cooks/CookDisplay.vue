<template>
  <nuxt-link
    :to="localePath(`/cooks/${cookID}/`)"
    class="following-cooks__cook"
  >
    <div
      role="img"
      v-if="photoURL"
      class="following-cooks__img margin-right--xlarge"
      :style="`background-image: url(${photoURL})`"
      :aria-label="displayName + '´s profile picture'"
    />
    <div
      v-else
      class="following-cooks__img flex-row flex-row--justify-center flex-row--align-center margin-right--xlarge"
    >
      <BackupImg />
    </div>
    <div class="flex-column">
      <h2 class="margin-bottom--small margin--none">
        {{ displayName ? displayName : "" }}
      </h2>
      <p class="following-cooks__biography margin--none">
        {{
          biography
            ? biography.substring(0, 70) + "..."
            : $t("cooks.noBiography")
        }}
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
    cookID: { type: String, default: "" },
    photoURL: { type: String, default: "" },
    displayName: { type: String, default: "" },
    biography: { type: String, default: "" }
  }
};
</script>
