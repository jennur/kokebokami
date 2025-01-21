<template>
  <NuxtLayout name="default">

    <main
      class="mobile-width padding-h-lg margin-auto margin-bottom-2xl"
      >
      <div class="container container--center">
        <h1 class="margin-top-2xl">{{ error.statusCode }} Whoops!</h1>
        <h2>{{ error.statusMessage }}</h2>
        <CrackedEggs class="illustration--cracked-eggs" />
        <h3>
          It looks like you're trying to access a page that does not exist, or
          that you don't have access to...
        </h3>
      </div>

      <div class="container container--center">
        <NuxtLink :to="$localePath('/')"
        >Take me back to the front page</NuxtLink
        >
      </div>
    </main>
  </NuxtLayout>
</template>

<script setup>
import CrackedEggs from "~/assets/graphics/illustrations/cracked-eggs.svg";


const props = defineProps({
  error: Object,
})

useHead(() => {
    return {
      title: `${props.error.statusCode || 500} | Kokebokami`,
      meta: [
        {
          name: "robots" ,
          content: "noindex"
        }
      ]
    }
  });
</script>
