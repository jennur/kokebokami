<template>
  <div>
    <p class="margin-bottom--xlarge">
      If you have a Google or Facebook account, there is no need to sign up -
      just login directly.
    </p>
    <google-login class="margin-bottom--medium" />
    <facebook-login class="margin-bottom--medium" />
    <!--     <sign-up-cookbook class="illustration illustration--sign-up-cookbook margin-top--xxlarge" />
    -->
  </div>
</template>

<script>
import GoogleLogin from "~/components/Login/GoogleLogin.vue";
import FacebookLogin from "~/components/Login/FacebookLogin.vue";

import SignUpCookbook from "~/assets/graphics/sign-up-cookbook.svg";
export default {
  name: "sign-in-with-provider",
  components: {
    GoogleLogin,
    FacebookLogin,
    SignUpCookbook
  }
};
</script>
