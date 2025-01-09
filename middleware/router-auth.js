export default function ({ redirect, route, app }) {
  if (route.path.indexOf("login") > -1) redirect(app.localePath("/"));

  const unsubscribe = app.$fire.auth.onAuthStateChanged((user) => {
    if (user) {
      if (user.emailVerified) {
        performAdminRedirect(route, redirect, app);
      } else {
        if (route.name.indexOf("verify-email") === -1) {
          redirect(app.localePath("verify-email"));
        }
      }
      unsubscribe();
    } else {
      if (onAdminRoute(route)) {
        console.log("Redirecting to home, unauthenticated user on admin route");
        redirect(app.localePath("/"));
      }
    }
  });
}

function onAdminRoute(route) {
  if (
    route.matched.some(
      (record) =>
        record.path.indexOf("account") > -1 ||
        record.path.indexOf("verify-email") > -1
    )
  ) {
    return true;
  }
}

function performAdminRedirect(route, redirect, app) {
  const unAuthPaths = ["login", "sign-up", "verify-email", "goodbye"];
  if (unAuthPaths.some((path) => route.path.indexOf(path) > -1)) {

  // Workaround for hydration issue on redirect in client
  window.onNuxtReady(() => {
    console.log("Redirecting to account");
    window.$nuxt.$router.push(app.localePath("account"))
  });
  }
}
