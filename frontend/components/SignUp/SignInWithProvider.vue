<template>
  <div>
    <p class="margin-bottom-xl">
      {{ $t("signUp.soMeLoginText") }}
    </p>
    <google-login class="margin-bottom-md" />
    <facebook-login class="margin-bottom-md" />
  </div>
</template>

<script>
import GoogleLogin from "~/components/Login/GoogleLogin.vue";
import FacebookLogin from "~/components/Login/FacebookLogin.vue";

export default {
  name: "sign-in-with-provider",
  components: {
    GoogleLogin,
    FacebookLogin
  }
};
</script>
