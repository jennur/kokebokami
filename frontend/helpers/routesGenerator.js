/* const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
require("firebase/database");
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : "";
const db = firebase.database();

export default async function() {
  const recipesRef = this.$fireDb.ref("recipes");

  return recipesRef.on(
    "value",
    function(snapshot) {
      console.log("Recipes:", snapshot);
    },
    function(error) {
      console.log("Error: Something failed while generating routes: " + error);
    }
  );
}
 */
// middleware: "router-auth",
/* routes: [
      {
        name: "index",
        path: "/",
        component: "pages/index.vue"
      },
      {
        name: "recipes",
        path: "/recipes",
        component: "pages/recipes/index.vue",
        children: [
          {
            name: "recipe",
            path: "/recipes/:recipeid?",
            component: "pages/recipes/_recipeid.vue"
          }
        ]
      },
      {
        name: "cooks",
        path: "/cooks",
        component: "pages/cooks/index.vue",
        children: [
          {
            name: "cook",
            path: "/cooks/:userid?",
            component: "pages/cooks/_userid.vue"
          }
        ]
      },
      {
        name: "login",
        path: "/login",
        component: "pages/login.vue"
      },
      { name: "sign-up", path: "/sign-up", component: "pages/sign-up.vue" },
      {
        name: "account",
        path: "/account",
        component: "pages/account/index.vue",
        children: [
          {
            name: "add-recipe",
            path: "/account/add-recipe",
            component: "pages/account/add-recipe.vue"
          },
          {
            name: "add-recipe-from-url",
            path: "/account/add-recipe-from-url",
            component: "pages/account/add-recipe-from-url.vue"
          },
          {
            name: "public-profile-view",
            path: "/account/public-profile-view",
            component: "pages/account/public-profile-view.vue"
          },
          {
            name: "goodbye",
            path: "/account/goodbye",
            component: "pages/account/goodbye.vue"
          }
        ]
      },
      {
        name: "my-recipes",
        path: "/my-recipes",
        component: "pages/my-recipes.vue"
      },
      {
        name: "verify-email",
        path: "/verify-email",
        component: "pages/verify-email.vue"
      },
      {
        name: "privacy-policy",
        path: "/privacy-policy",
        component: "pages/privacy-policy.vue"
      },
      {
        name: "cookies-policy",
        path: "/cookies-policy",
        component: "pages/cookies-policy.vue"
      },
      {
        name: "terms-and-conditions",
        path: "/terms-and-conditions",
        component: "pages/terms-and-conditions.vue"
      }
    ] */
