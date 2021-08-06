<template>
  <button class="kokebokami-login-btn">
    <img
      class="kokebokami-login-btn_logo"
      src="/icon.png"
      alt="kokebokami logo"
    />
    <span class="kokebokami-login-btn_text"
      >{{ $t("loginWith") }} Kokebokami</span
    >
  </button>
</template>
<script>
export default {
  name: "kokebokami-button"
};
</script>
