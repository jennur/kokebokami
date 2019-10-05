import { auth } from "~/services/firebase.js";

export default context => {
  const { store } = context;
  auth.onAuthStateChanged(user => {
    if (user) {
      store.commit("setUser", user);
    }
  });
};
