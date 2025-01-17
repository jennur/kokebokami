<template>
  <div class="container container--center margin-auto margin-bottom-xl">

    <div v-if="authStore.user && hidden">
      <cook-silhouette class="illustration--cook-bubble" />
      <div>
        <h3> Hmmm... </h3>
        <p> The profile you're trying to access seems to be hidden or not existing </p>
        <NuxtLink v-if="user && user.id" to="/cooks/">
          Discover other cooks ➔
        </NuxtLink>
      </div>
    </div>

    <div v-else class="flex-center-container flex-column margin-top-xl">
      <h3> Login to discover cooks </h3>
      <CookSilhouette class="illustration--cook-bubble" />

      <div class="margin-auto">
        <LoginContainer class="margin-top-xl" @update="$emit('update')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import CookSilhouette from "~/assets/graphics/icons/cook-silhouette-circle.svg";
import LoginContainer from "~/components/Login/LoginContainer";
import { useAuthStore } from "~/store";

const authStore = useAuthStore();

const props = defineProps({
  hidden: {
    type: Boolean,
    default: false
  }
})
</script>
