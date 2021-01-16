export default function(context) {
  let { redirect, route, app } = context;
  let unsubscribe = app.$fire.auth.onAuthStateChanged(user => {
    if (user) {
      if (
        user.emailVerified ||
        user.providerData[0].providerId === "facebook.com"
        // Facebook users´ e-mail addresses are NOT automatically verified (Google users´ are)
      ) {
        performAdminRedirect(route, redirect, app);
      } else if (
        !user.emailVerified &&
        user.providerData[0].providerId === "password"
      ) {
        if (route.name.indexOf("verify-email") === -1) {
          redirect(app.localePath("/verify-email/"));
        }
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

function performAdminRedirect(route, redirect, app) {
  if (
    route.path.indexOf("login") > -1 ||
    route.path.indexOf("sign-up") > -1 ||
    route.path.indexOf("verify-email") > -1 ||
    route.path.indexOf("goodbye") > -1
  ) {
    console.log("Redirecting to account");
    redirect(app.localePath("/account/"));
  }
}
