<template>
  <div class="container">
    <h2>Welcome back, {{this.firstName}}!</h2>
    <recipes-list headline="Here are your recipes" />
  </div>
</template>

<script>
import { user } from "~/mixins/getCurrentUser.js";
import RecipesList from "~/components/RecipesList.vue";

export default {
  name: "account",
  components: { RecipesList },
  mixins: [user],
  computed: {
    firstName() {
      return this.user ? this.user.name.split(" ")[0] : null;
    }
  }
};
</script>

