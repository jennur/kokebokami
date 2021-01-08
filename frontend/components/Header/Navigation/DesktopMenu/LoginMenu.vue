<template>
  <div class="dropdown-menu">
    <span class="pointer"></span>
    <login-container />
  </div>
</template>
<script>
import GoogleBtn from "../../../Login/GoogleLogin.vue";
import FacebookBtn from "../../../Login/FacebookLogin.vue";
import KokebokamiBtn from "../../../Login/KokebokamiButton.vue";
import LoginContainer from "../../../Login/LoginContainer.vue";
export default {
  name: "dropdown-menu",
  components: {
    LoginContainer
  }
};
</script>
