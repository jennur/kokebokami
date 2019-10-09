export const user = {
  computed: {
    user() {
      return this.$store.getters.user;
    }
  }
};
