<template>
  <div>
    <p class="margin-bottom--xlarge">
      If you have a Google or Facebook account, there is no need to sign up -
      just login directly.
    </p>
    <google-login class="margin-bottom--medium" />
    <facebook-login class="margin-bottom--medium" />
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
