import { auth, db } from "~/plugins/firebase.js";

export default context => {
  const { store, redirect } = context;
  auth
    .getRedirectResult()
    .then(result => {
      console.log("Redirect", result.user);
    })
    .catch(error => console.log("Redirect error:", error));

  auth.onAuthStateChanged(user => {
    if (user) {
      if (
        !user.emailVerified &&
        user.providerData[0].providerId !== "facebook.com"
      ) {
        redirect("/verify-email");
      } else {
        setUserData(store, user);
      }
    }
  });
};

function setUserData(store, user) {
  store.dispatch("SET_ALL_USERS");
  let loggedinUser = {};
  let userRef = db.ref("users/" + user.uid);

  userRef.once("value", snapshot => {
    if (snapshot.exists()) {
      loggedinUser = {
        id: user.uid,
        photoURL: snapshot.val().photoURL,
        displayName: snapshot.val().displayName,
        email: snapshot.val().email,
        biography: snapshot.val().biography,
        following: snapshot.val().following,
        followers: snapshot.val().followers
      };
    } else {
      let databaseUser = {
        displayName: user.displayName ? user.displayName : "User",
        photoURL: user.photoURL && user.photoURL,
        email: user.email
        // No more details available upon first login
      };
      userRef.set(databaseUser);

      loggedinUser = {
        id: user.uid,
        photoURL: user.photoURL && user.photoURL,
        displayName: user.displayName && user.displayName,
        email: user.email
        // No more details available upon first login
      };
    }
    store.dispatch("SET_USER", loggedinUser);
    store.dispatch("SET_SHARED_RECIPES", loggedinUser);
    store.dispatch("SET_PUBLIC_RECIPES");
    store.dispatch("SET_USER_RECIPES", loggedinUser);
  });
}
