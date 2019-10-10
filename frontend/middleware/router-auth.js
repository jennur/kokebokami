export default function({ store, redirect, route }) {
  store.getters.user !== null &&
  store.getters.user !== undefined &&
  route.name == "login"
    ? redirect("/account")
    : "";
  store.getters.user === null && isAdminRoute(route) ? redirect("/login") : "";
}

function isAdminRoute(route) {
  if (route.matched.some(record => record.path == "/account")) {
    return true;
  }
}
