<template>
  <div class="container container--center margin-auto margin-bottom-xl">

    <div v-if="$store.state.user && hidden">
      <cook-silhouette class="illustration--cook-bubble" />
      <div>
        <h3> Hmmm... </h3>
        <p> The profile you're trying to access seems to be hidden or not existing </p>
        <nuxt-link v-if="user && user.id" to="/cooks/">
          Discover other cooks ➔
        </nuxt-link>
      </div>
    </div>

    <div v-else class="flex-center-container flex-column margin-top-xl">
      <h3> Login to discover cooks </h3>
      <cook-silhouette class="illustration--cook-bubble" />

      <div class="margin-auto">
        <login-container class="margin-top-xl" @update="$emit('update')" />
      </div>
    </div>
  </div>
</template>

<script>
import cookSilhouette from "~/assets/graphics/icons/cook-silhouette-circle.svg";
import user from "~/mixins/user";
import LoginContainer from "~/components/Login/LoginContainer";

export default {
  name: "cook-hidden",
  components: {
    cookSilhouette,
    LoginContainer
  },
  props: {
    hidden: {
      type: Boolean,
      default: false
    }
  },
  mixins: [user]
}
</script>
