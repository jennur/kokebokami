export default {
  computed: {
    user() {
      return (
        this.$store.state.user || {
          id: null,
          displayName: null,
          photoURL: null,
          email: null
        }
      );
    }
  }
};
