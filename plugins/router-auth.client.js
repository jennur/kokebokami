/* 
 * This is added to make sure router-auth runs client side on page load,
 * since the middleware only runs server side the first time.
 */
import routerAuth from "~/middleware/router-auth.js";
import { useRouter } from "vue-router";

export default defineNuxtPlugin(nuxtApp => {
  const router = useRouter();
  router.afterEach(() => routerAuth());
})
