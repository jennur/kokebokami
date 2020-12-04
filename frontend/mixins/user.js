export default {
  computed: {
    user() {
      let user = JSON.parse(JSON.stringify(this.$store.state.user));
      return (
        user || {
          id: null,
          displayName: null,
          photoURL: null,
          email: null
        }
      );
    }
  }
};
