<template>
  <div class="dropdown-menu">
    <span class="pointer"></span>
    <login-container />
  </div>
</template>

<script>
import LoginContainer from "../../../Login/LoginContainer.vue";
export default {
  name: "dropdown-menu",
  components: {
    LoginContainer
  }
};
</script>
