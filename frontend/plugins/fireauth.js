import { auth, db } from "~/plugins/firebase.js";

export default context => {
  const { store } = context;

  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(user => {
      if (user) {
        let userRef = db.ref("users/" + user.uid);

        userRef.once("value", snapshot => {
          if (snapshot.exists()) {
            let loggedinUser = {
              id: user.uid,
              profileImg: snapshot.val().photoURL,
              name: snapshot.val().displayName,
              email: snapshot.val().email
            };
            store.dispatch("SET_USER", loggedinUser);
            store.dispatch("SET_SHARED_RECIPES", loggedinUser);

            return resolve(store.dispatch("SET_USER_RECIPES", loggedinUser));
          } else {
            //Assuming that user is coming via Google/Facebook (custom users are added on signup)
            let databaseUser = {
              displayName: user.displayName,
              photoURL: user.photoURL,
              email: user.email
            };
            userRef.set(databaseUser);

            let loggedinUser = {
              id: user.uid,
              profileImg: user.photoURL,
              name: user.displayName,
              email: user.email
            };
            store.dispatch("SET_USER", loggedinUser);
            store.dispatch("SET_SHARED_RECIPES", loggedinUser);

            return resolve(store.dispatch("SET_USER_RECIPES", loggedinUser));
          }
        });
      }
      return resolve();
    });
  });
};
