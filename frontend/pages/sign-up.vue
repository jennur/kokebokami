<template>
  <div>
    <sign-up-section
      headline="Sign up to start adding your recipes"
      :bigHeadline="true"
      :darkBg="false"
    />
  </div>
</template>

<script>
import SignUpSection from "~/components/SignUp/SignUpSection.vue";
import user from "~/mixins/user.js";

export default {
  name: "sign-up",
  components: {
    SignUpSection
  },
  mixins: [user]
};
</script>
