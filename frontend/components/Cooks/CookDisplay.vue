<template>
  <nuxt-link
    :to="'cooks/' + cookID"
    class="following-cooks__cook margin--small"
  >
    <div
      role="img"
      v-if="photoURL"
      class="following-cooks__img margin-right--xlarge"
      :style="`background-image: url(${photoURL})`"
      :aria-label="displayName + '´s profile picture'"
    />
    <div v-else class="following-cooks__img margin-right--xlarge"></div>
    <div class="flex-column">
      <h2 class="margin-bottom--small margin--none">
        {{ displayName ? displayName : "" }}
      </h2>
      <p class="following-cooks__biography margin--none">
        {{
          biography
            ? biography.substring(0, 70) + "..."
            : "This user did not write a biography yet."
        }}
      </p>
    </div>
  </nuxt-link>
</template>
<script>
export default {
  name: "cook-display",
  props: {
    cookID: { type: String, default: "" },
    photoURL: { type: String, default: "" },
    displayName: { type: String, default: "" },
    biography: { type: String, default: "" }
  }
};
</script>
