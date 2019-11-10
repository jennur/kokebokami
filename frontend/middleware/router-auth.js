export default function({ store, redirect, route }) {
  const userExists =
    store.getters.user !== null && store.getters.user !== undefined;

  userExists && (route.name == "login" || route.name == "sign-up")
    ? redirect("/my-recipes")
    : "";
  store.getters.user === null && isAdminRoute(route) ? redirect("/login") : "";
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
