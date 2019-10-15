import { auth } from "~/plugins/firebase.js";

export default context => {
  const { store } = context;

  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(user => {
      if (user) {
        let loggedinUser = {
          id: user.uid,
          profileImg: user.photoURL,
          name: user.displayName
        };
        store.dispatch("SET_USER", loggedinUser);
        return resolve(store.dispatch("SET_USER_RECIPES", loggedinUser));
      }
      return resolve();
    });
  });
};
