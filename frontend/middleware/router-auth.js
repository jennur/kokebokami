import { auth } from "../plugins/firebase.js";

export default function({ store, redirect, route, router }) {
  let storeUser = store.state.user;
  if (storeUser) {
    performRedirect(route, redirect);
  }
  auth.onAuthStateChanged(user => {
    console.log("Logging in:", user);
    if (
      user &&
      (user.emailVerified || user.providerData[0].providerId === "facebook.com")
    ) {
      performRedirect(route, redirect, router);
    }
    !user && isAdminRoute(route) && redirect("/login");
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

function performRedirect(route, redirect, router) {
  console.log("Route:", route, router);
  if (
    route.name.indexOf("login") > -1 ||
    route.name == "sign-up" ||
    route.name == "verify-email"
  ) {
    console.log("Router", router);
    redirect("/my-recipes");
  }
}
