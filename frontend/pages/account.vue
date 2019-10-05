<template>
  <div class="container">
    <div class="google-profile">
      <img class="google-profile__picture" :src="user.photoURL" alt="Google profile picture" />
      <p>{{ user.displayName }}</p>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

import Logo from "~/components/Logo.vue";

export default {
  components: {
    Logo
  },
  computed: {
    user() {
      console.log(this.$store.state.user.user);
      return this.$store.state.user.user;
    }
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.google-profile {
  display: inline-flex;
  align-items: center;
  justify-content: space-around;
  width: 170px;
}
.google-profile__picture {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
