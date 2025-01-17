import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router';
import { useNuxtApp } from 'nuxt/app';
import { useAuthStore } from '~/store';

export default defineNuxtRouteMiddleware((to, from) => {
  // const { $localePath } = useNuxtApp();
  // const { currentRoute: route, push } = useRouter();

  // const auth = getAuth();
  // const unsubscribe = onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     console.log("USER:", user);
  //     if (user.emailVerified) {
  //       console.log("EMAIL IS VERIFIED")
  //       const authStore = useAuthStore();
  //       authStore.LOGIN_SUCCESS();
  //       performAdminRedirect();
  //     } else {
  //       if (route.name.indexOf("verify-email") === -1) {
  //         push($localePath("verify-email"));
  //       }
  //     }
  //   } else {
  //     if (onAdminRoute()) {
  //       console.log("Redirecting to home, unauthenticated user on admin route");
  //       push($localePath("/"));
  //     }
  //   }
  // });
  // unsubscribe();

  // function onAdminRoute() {
  //   if (
  //     route.value.matched.some(
  //       (record) =>
  //         record.path.indexOf("account") > -1 ||
  //         record.path.indexOf("verify-email") > -1
  //     )
  //   ) {
  //     return true;
  //   }
  // }
  
  // function performAdminRedirect() {
  //   console.log("\n\nRouter:", route);
  //   const unAuthPaths = ["login", "sign-up", "verify-email", "goodbye"];
  //   if (unAuthPaths.some((path) => route.value.path.indexOf(path) > -1)) {
  //     push($localePath("account"))
  //   }
  // }
});

