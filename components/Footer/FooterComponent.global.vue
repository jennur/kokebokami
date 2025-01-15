<template>
  <footer class="footer">
    <div class="footer_columns">
      <ul class="footer_nav margin-lg">
        <li>
          <h4 class="color--blue">
            {{ $t("navigation.footer.languageHeading") }}
          </h4>
        </li>
        <LanguageNavigation />
      </ul>

      <ul class="footer_nav margin-lg">
        <li>
          <h4 class="color--blue">
            {{ $t("navigation.footer.aboutHeading") }}
          </h4>
        </li>
        <li>
          <NuxtLink :to="$localePath('/about/')">{{
            $t("navigation.footer.aboutText")
          }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="$localePath('/privacy-policy/')"
            >Privacy policy</NuxtLink
          >
        </li>
        <li>
          <NuxtLink :to="$localePath('/cookies-policy/')"
            >Cookies policy</NuxtLink
          >
        </li>
      </ul>
    </div>
    <p class="footer_copyright">© {{ year }} Kokebokami</p>
  </footer>
</template>
<script setup>
import LanguageNavigation from "../LanguageNavigation.vue";

const year = new Date().getFullYear();
</script>
