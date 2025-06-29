import { getDatabase } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";
import { navigateTo, useNuxtApp } from "nuxt/app";
import { useAuthStore } from "~/store";

export default defineNuxtPlugin(async (nuxtApp) => {
  const { $localePath } = useNuxtApp();
  const { currentRoute: route, push } = useRouter();
  const auth = getAuth();

  const startAuthListener = () => {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const authStore = useAuthStore();
          authStore.LOGIN_SUCCESS();
          performAdminRedirect();
          resolve();
        }
      });
    });
  };
  startAuthListener();

  addRouteMiddleware(
    "auth",
    (to, from) => {
      const authStore = useAuthStore();

      if (!authStore.user && onAdminRoute(to)) {
        return navigateTo($localePath("/"));
      }
    },
    { global: true }
  );

  function onAdminRoute(to) {
    return (
      to.path.indexOf("account") > -1
    );
  }

  function performAdminRedirect() {
    const unAuthPaths = ["login", "sign-up", "goodbye"];
    if (unAuthPaths.some((path) => route.value.path.indexOf(path) > -1)) {
      navigateTo($localePath("account"));
    }
  }
  // Make Firebase's database available globally in the app
  nuxtApp.provide("getDatabase", getDatabase);
});
