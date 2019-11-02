<template>
  <div>
    <section class="container">
      <div
        class="flex-center-container flex-center-container--column mobile-width padding--none margin--auto"
      >
        <h1 class="heading--display-font">It's time to digitalize your cook book!</h1>

        <nuxt-link
          to="/login"
          class="button button--large padding-horizontal--xlarge margin-top--large"
          v-if="!user"
        >Get started ➔</nuxt-link>
      </div>
      <div class="flex-center-container">
        <kokeboka class="graphic graphic--kokeboka" />
      </div>
    </section>
    <section class="container container--blue padding--xlarge" v-if="!user">
      <div class="flex-row tablet-width margin--auto">
        <div class="flex-row__half">
          <h3>Sign up to start building your own cook book.</h3>
          <p
            class="margin-bottom--xlarge"
          >If you have a Google or Facebook account, there is no need to sign up - just login directly.</p>
          <google-login class="margin-bottom--medium" />
          <facebook-login class="margin-bottom--medium" />
        </div>
        <sign-up-form class="flex-row__half dark-bg" />
      </div>
    </section>
  </div>
</template>

<script>
import firebase from "firebase";
import { GoogleProvider, auth } from "~/plugins/firebase.js";
import googleLogo from "~/static/btn_google_light_normal_ios.svg";
import { user } from "~/mixins/getCurrentUser.js";
import kokeboka from "~/assets/graphics/kokeboka.svg";
import SignUpForm from "~/components/SignUpForm.vue";
import GoogleLogin from "~/components/Login/GoogleLogin.vue";
import FacebookLogin from "~/components/Login/FacebookLogin.vue";

export default {
  name: "Home",
  components: { kokeboka, GoogleLogin, FacebookLogin, SignUpForm },
  mixins: [user]
};
</script>
