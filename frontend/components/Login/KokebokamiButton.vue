<template>
  <button class="kokebokami-login-btn">
    <img
      class="kokebokami-login-btn__logo"
      src="/icon.png"
      alt="kokebokami logo"
    />
    <span class="kokebokami-login-btn__text"
      >{{ $t("loginWith") }} Kokebokami</span
    >
  </button>
</template>
<script>
export default {
  name: "kokebokami-button"
};
</script>
