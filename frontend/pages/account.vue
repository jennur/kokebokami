<template>
  <div class="container">
    <div class="google-profile" v-if="user">
      <img class="google-profile__picture" :src="user.profileImg" alt="Google profile picture" />
      <p>{{ user.name }}</p>
    </div>
  </div>
</template>

<script>
import { user } from "~/mixins/getCurrentUser.js";

export default {
  name: "Account",
  components: {},
  mixins: [user]
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
