export default function(context) {
  let { redirect, route } = context;
  if (
    route.fullPath.indexOf("?") === -1 &&
    route.path &&
    !route.path.endsWith("/")
  ) {
    redirect(`${route.path}/`);
  }
}
