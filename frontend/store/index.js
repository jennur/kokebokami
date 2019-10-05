const state = () => ({
  count: 0,
  user: null
});

export const mutations = {
  increment(state) {
    state.count++;
  },
  setUser(state, user) {
    state.user = user;
  }
};

export const actions = {
  SET_USER: ({ commit }, user) => {
    commit("setUser", user);
  }
};
