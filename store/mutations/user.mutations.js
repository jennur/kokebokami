
export const userMutations = {
  setUser(state, payload) {
    state.user = payload;
  },
  updateUsername(state, payload) {
    state.user.displayName = payload;
    state.showUsernameModal = false;
  },
  updateUserFavorites(state, payload) {
    state.user.favorites = payload;
  }
};
