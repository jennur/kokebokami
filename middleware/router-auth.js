export default function({ redirect, route, app }) {
  let unsubscribe = app.$fire.auth.onAuthStateChanged(user => {
    if (user) {
      if (user.emailVerified) {
        return performAdminRedirect(route, redirect, app);
      } 
      else {
        if (route.name.indexOf("verify-email") === -1) {
          redirect(app.localePath("/verify-email/"));
        }
      }
      unsubscribe();
    } 
    else {
      if (onAdminRoute(route)) {
        console.log("Redirecting to login, unauthenticated user on admin route");
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
  let unauthPaths = ["login", "sign-up", "verify-email", "goodbye"];

  unauthPaths.forEach(path => {
    if(route.path.indexOf(path) > -1) {
      console.log("Rederecting to account");
      return redirect(app.localePath("/account/"));
    }
  })
}
