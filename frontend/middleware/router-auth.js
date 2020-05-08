import { auth } from "../plugins/firebase.js";

export default function({ store, redirect, route }) {
  let storeUser = store.state.user;
  if (storeUser) {
    performRedirect(route, redirect);
  }
  auth
    .onAuthStateChanged(user => {
      console.log("User router-auth::", user);
      if (user && user.emailVerified) {
        performRedirect(route, redirect);
      }
      !user && isAdminRoute(route) ? redirect("/login") : "";
    })
    .catch(error => "AuthStateChange error:", error);
}

function isAdminRoute(route) {
  if (route.matched.some(record => record.path.indexOf("account") > -1)) {
    return true;
  } else if (
    route.matched.some(record => record.path.indexOf("recipes") > -1)
  ) {
    return true;
  } else if (
    route.matched.some(record => record.path.indexOf("verify-email") > -1)
  ) {
    return true;
  }
}

function performRedirect(route, redirect) {
  if (
    route.name == "login" ||
    route.name == "sign-up" ||
    route.name == "verify-email"
  ) {
    redirect("/my-recipes");
  }
}
