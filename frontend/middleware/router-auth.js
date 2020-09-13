export default function(context) {
  let { redirect, route, app } = context;
  let unsubscribe = app.$fireAuth.onAuthStateChanged(user => {
    if (user) {
      if (
        user.emailVerified ||
        user.providerData[0].providerId === "facebook.com"
        // Facebook users´ e-mail addresses are NOT automatically verified (Google users´ are)
      ) {
        performRedirect(route, redirect, app);
      } else if (
        !user.emailVerified &&
        user.providerData[0].providerId === "password"
      ) {
        if (route.name !== "verify-email")
          redirect(app.localePath("/verify-email/"));
        console.log("Redirecting to verify email");
      }
      unsubscribe();
    } else {
      if (onAdminRoute(route)) {
        console.log(
          "Redirecting to login, unauthenticated user on admin route"
        );
        redirect(app.localePath("/login/"));
      }
    }
  });
  if (route.name === "recipes") redirect(app.localePath("/"));
}

function onAdminRoute(route) {
  if (route.matched.some(record => record.path.indexOf("account") > -1)) {
    return true;
  } else if (
    route.matched.some(record => record.path.indexOf("verify-email") > -1)
  ) {
    return true;
  }
}

function performRedirect(route, redirect, app) {
  console.log("Routename:", route.name);
  if (
    route.name.indexOf("login") > -1 ||
    route.name.indexOf("sign-up") > -1 ||
    route.name.indexOf("verify-email") > -1 ||
    route.name.indexOf("goodbye") > -1
  ) {
    console.log("Redirecting to account");
    redirect(app.localePath("/account/"));
  }
}
