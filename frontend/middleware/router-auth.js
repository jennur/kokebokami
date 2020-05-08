import { auth } from "../plugins/firebase.js";

export default function({ store, redirect, route }) {
  let storeUser = store.state.user;
  if (storeUser) {
    performRedirect(route, redirect);
  }
  auth.onAuthStateChanged(user => {
    if (
      user &&
      (user.emailVerified || user.providerData[0].providerId === "facebook.com")
    ) {
      performRedirect(route, redirect);
    }
    !user && isAdminRoute(route) ? redirect("/login") : "";
  });
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
