<template>
  <nuxt-link :to="'cooks/' + cookID" class="following-cooks__cook margin--small">
    <img
      class="following-cooks__img margin-right--xlarge"
      v-if="photoURL"
      :src="photoURL"
      :alt="displayName + '´s profile picture'"
    />
    <div class="flex-column">
      <h2
        class="heading--display-font margin-bottom--small margin--none"
      >{{displayName ? displayName : ""}}</h2>
      <p
        class="following-cooks__biography margin--none"
      >{{biography ? (biography.substring(0,70) + "...") : "This user did not write a biography yet."}}</p>
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
