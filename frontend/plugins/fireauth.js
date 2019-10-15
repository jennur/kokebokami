import { auth } from "~/plugins/firebase.js";

export default context => {
  console.log("CONTEXT::: " + context);
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
        store.dispatch("SET_USER_RECIPES", loggedinUser);
        return resolve();
      }
      return reject(error =>
        console.log("Something went wrong in fireauth: " + error)
      );
    });
  });
};
