export default function(context) {
  let { redirect, route, app } = context;
  let unsubscribe = app.$fireAuth.onAuthStateChanged(user => {
    if (user) {
      if (
        user.emailVerified ||
        user.providerData[0].providerId === "facebook.com"
      ) {
        performRedirect(route, redirect);
      } else if (
        !user.emailVerified &&
        user.providerData[0].providerId === "password"
      ) {
        if (route.name !== "verify-email") redirect("/verify-email/");
        console.log("Redirecting to verify email");
      }
      unsubscribe();
    } else {
      if (onAdminRoute(route)) {
        console.log(
          "Redirecting to login, unauthenticated user on admin route"
        );
        redirect("/login/");
      }
    }
  });
}

function onAdminRoute(route) {
  if (route.matched.some(record => record.path.indexOf("account") > -1)) {
    return true;
  } else if (route.matched.some(record => record.path.indexOf("cooks") > -1)) {
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
    route.name == "verify-email" ||
    route.name == "goodbye"
  ) {
    console.log("Redirecting to account");
    redirect("/account/");
  }
}
