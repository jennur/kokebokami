// Make sure router-auth runs client side on page load

import routerAuth from "~/middleware/router-auth.js";

export default function(context) {
  context.app.router.afterEach(() => {
    routerAuth(context);
  });

  context.app.$fire.auth.getRedirectResult().catch(error => {
    console.log("Redirect error:", error.message);
    context.store.dispatch("SET_LOGIN_MESSAGE", error.message);
  });
  //console.log("i18n", context);
  //context.store.state.allCategories = context.app.$i18n.allCategories;
}
