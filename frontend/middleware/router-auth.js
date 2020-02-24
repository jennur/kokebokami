export default function({ store, redirect, route }) {
  let user = store.state.user;
  console.log("Route::", route.name);
  if (user && user.verifiedEmail) {
    console.log("Route::", route.name);
    if (
      route.name == "login" ||
      route.name == "sign-up" ||
      route.name == "verify-email"
    ) {
      redirect("/my-recipes");
    }
  }
  !user && isAdminRoute(route) ? redirect("/login") : "";
}

function isAdminRoute(route) {
  if (route.matched.some(record => record.path.indexOf("account") > -1)) {
    return true;
  } else if (
    route.matched.some(record => record.path.indexOf("recipes") > -1)
  ) {
    return true;
  }
}
