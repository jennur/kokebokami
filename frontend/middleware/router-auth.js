export default function({ store, redirect, route }) {
  let user = store.state.user;

  if (user && user.verifiedEmail) {
    if (
      route.name == "login" ||
      route.name == "sign-up" ||
      route.name == "account-verify-email"
    ) {
      redirect("/my-recipes");
    }
  }
  user === null && isAdminRoute(route) ? redirect("/login") : "";
  route.name == "recipes" ? redirect("/") : "";
}

function isAdminRoute(route) {
  if (route.matched.some(record => record.path == "/account")) {
    return true;
  } else if (route.matched.some(record => record.path == "/my-recipes")) {
    return true;
  } else if (
    route.matched.some(record => record.path == "/account/add-recipe")
  ) {
    return true;
  }
}
