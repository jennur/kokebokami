<template>
  <section class="initial-info-section container--orange">
    <div
      class="flex-center-container flex-center-container--column tablet-width padding--none margin-auto"
    >
      <h1 class="container--center padding-h-lg">
        {{ $t("introHeading") }}
      </h1>
      <p
        class="padding-h-lg color--blue mobile-width text-align--center"
      >
        {{ $t("introDescription") }}
      </p>
      <NuxtLink
        :to="$localePath('/sign-up/')"
        class="button button-lg padding-h-xl margin-v-lg"
      >
        {{ $t("introCTA") }} ➔
      </NuxtLink>
    </div>
  </section>
</template>

<script setup></script>
