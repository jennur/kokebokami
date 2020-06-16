<template>
  <div>
    <breadcrumbs :routes="breadcrumbs" />

    <div class="flex-center-container flex-center-container--column">
      <h2 class="margin-bottom--large">One last step!</h2>
      <p>
        To create your account, we need you to verify your e-mail address.
        Please login to your e-mail and click the verification link.
        <br />
        <br />
        If you don't receive the e-mail, please contact us.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "verify-email",
  head() {
    return {
      title: `Verify email | Kokebokami`,
      link: [
        {
          rel: "canonical",
          href: "https://www.kokebokami.com/verify-email/"
        }
      ]
    };
  },
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [{ name: "Home", link: "/" }, { name: "Verify email" }]
    }
  }
};
</script>
