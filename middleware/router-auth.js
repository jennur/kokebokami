import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router';
import { useNuxtApp } from 'nuxt/app';
import { useAuthStore } from '~/store';

export default defineNuxtRouteMiddleware((to, from) => {
  const { $localePath } = useNuxtApp();
  const { currentRoute: route, push } = useRouter();
  if (route.value.path.indexOf("login") > -1) push($localePath("/"));

  const auth = getAuth();
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      const authStore = useAuthStore();
      authStore.LOGIN_SUCCESS();

      if (user.emailVerified) {
        performAdminRedirect(route);
      } else {
        if (route.name.indexOf("verify-email") === -1) {
          push($localePath("verify-email"));
        }
      }
      unsubscribe();
    } else {
      if (onAdminRoute(route)) {
        console.log("Redirecting to home, unauthenticated user on admin route");
        push($localePath("/"));
      }
    }
  });
});

function onAdminRoute(route) {
  if (
    route.matched.some(
      (record) =>
        record.path.indexOf("account") > -1 ||
        record.path.indexOf("verify-email") > -1
    )
  ) {
    return true;
  }
}

function performAdminRedirect(route) {
  const unAuthPaths = ["login", "sign-up", "verify-email", "goodbye"];
  if (unAuthPaths.some((path) => route.value.path.indexOf(path) > -1)) {

  // Workaround for hydration issue on redirect in client
  window.onNuxtReady(() => {
    console.log("Redirecting to account");
    window.$nuxt.$router.push($localePath("account"))
  });
  }
}
