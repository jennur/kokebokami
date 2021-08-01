<template>
  <div>
    <p class="margin-bottom-xl">
      {{ $t("signUp.soMeLoginText") }}
    </p>
    <google-login class="margin-bottom-md" />
  </div>
</template>

<script>
import GoogleLogin from "~/components/Login/GoogleLogin.vue";

export default {
  name: "sign-in-with-provider",
  components: {
    GoogleLogin
  }
};
</script>
