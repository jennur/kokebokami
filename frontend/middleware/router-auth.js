export default function({ store, redirect, route }) {
  const userExists =
    store.getters.user !== null && store.getters.user !== undefined;

  userExists && (route.name == "login" || route.name == "sign-up")
    ? redirect("/account/my-recipes")
    : "";
  store.getters.user === null && isAdminRoute(route) ? redirect("/login") : "";
}

function isAdminRoute(route) {
  if (route.matched.some(record => record.path == "/account/my-recipes")) {
    return true;
  }
}
