<template>
  <section class="container padding--xlarge">
    <div class="flex-row flex-row--justify-center tablet-width margin--auto">
      <div
        class="flex-row__half flex-column max-width--300-600 margin-right--xlarge margin-top--large"
      >
        <h3 v-if="headline">{{headline}}</h3>
        <p
          class="margin-bottom--xlarge"
        >If you have a Google or Facebook account, there is no need to sign up - just login directly.</p>
        <google-login class="margin-bottom--medium" />
        <facebook-login class="margin-bottom--medium" />
      </div>
      <sign-up-form
        :class="'flex-row__half '+ (darkBg ? 'dark-bg' : '')  + ' margin-top--xxlarge'"
      />
    </div>
  </section>
</template>

<script>
import SignUpForm from "./SignUpForm.vue";
import GoogleLogin from "~/components/Login/GoogleLogin.vue";
import FacebookLogin from "~/components/Login/FacebookLogin.vue";

export default {
  name: "sign-up-section",
  components: {
    SignUpForm,
    GoogleLogin,
    FacebookLogin
  },
  props: {
    darkBg: {
      type: Boolean,
      default: false
    },
    headline: {
      type: String,
      default: null
    }
  }
};
</script>
