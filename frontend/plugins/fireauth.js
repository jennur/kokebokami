import { auth, db } from "~/plugins/firebase.js";

export default context => {
  const { store } = context;

  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(user => {
      if (user) {
        store.dispatch("SET_ALL_USERS");

        let userRef = db.ref("users/" + user.uid);
        userRef.once("value", snapshot => {
          if (snapshot.exists()) {
            let loggedinUser = {
              id: user.uid,
              photoURL: snapshot.val().photoURL,
              displayName: snapshot.val().displayName,
              email: snapshot.val().email,
              biography: snapshot.val().biography,
              following: snapshot.val().following,
              followers: snapshot.val().followers
            };
            store.dispatch("SET_USER", loggedinUser);
            store.dispatch("SET_SHARED_RECIPES", loggedinUser);
            store.dispatch("SET_PUBLIC_RECIPES");

            return resolve(store.dispatch("SET_USER_RECIPES", loggedinUser));
          } else {
            //Assuming that user is coming via Google/Facebook for the first time (custom users are added on signup)
            let databaseUser = {
              displayName: user.displayName,
              photoURL: user.photoURL,
              email: user.email
              // No more details available upon first login
            };
            userRef.set(databaseUser);

            let loggedinUser = {
              id: user.uid,
              photoURL: user.photoURL,
              displayName: user.displayName,
              email: user.email
              // No more details available upon first login
            };
            store.dispatch("SET_USER", loggedinUser);
            store.dispatch("SET_SHARED_RECIPES", loggedinUser);
            store.dispatch("SET_PUBLIC_RECIPES");
            return resolve(store.dispatch("SET_USER_RECIPES", loggedinUser));
          }
        });
      }
      return resolve();
    });
  });
};
