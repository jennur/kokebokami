export default function({ store, redirect, route }) {
  store.state.user != null && route.name == "/" ? redirect("/account") : "";
  store.state.user == null ? redirect("/") : "";
}
