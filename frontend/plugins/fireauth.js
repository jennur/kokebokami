import { auth } from "~/plugins/firebase.js";

export default context => {
  const { store } = context;
  auth.onAuthStateChanged(user => {
    if (user) {
      store.commit("setUser", user);
    }
  });
};
