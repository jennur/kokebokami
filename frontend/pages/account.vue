<template>
  <div class="container">
    <h2>Welcome back, {{this.firstName}}!</h2>
  </div>
</template>

<script>
import { user } from "~/mixins/getCurrentUser.js";

export default {
  name: "Account",
  components: {},
  mixins: [user],
  computed: {
    firstName() {
      return this.user ? this.user.name.split(" ")[0] : null;
    }
  }
};
</script>

