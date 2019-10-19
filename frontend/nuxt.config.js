require("dotenv").config();
var { google } = require("googleapis");
const axios = require("axios");

// Initialize the service account key object.
const serviceAccount = {
  type: "service_account",
  project_id: process.env.NUXT_ENV_PROJECT_ID,
  private_key_id: process.env.NUXT_ENV_PRIVATE_KEY_ID,
  private_key: process.env.NUXT_ENV_PRIVATE_KEY,
  client_email: process.env.NUXT_ENV_CLIENT_EMAIL,
  client_id: process.env.NUXT_ENV_CLIENT_ID,
  auth_uri: process.env.NUXT_ENV_AUTH_URI,
  token_uri: process.env.NUXT_ENV_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.NUXT_ENV_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.NUXT_ENV_CLIENT_CERT_URL
};
// Define the required scopes.
var scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/firebase.database"
];

// Authenticate a JWT client with the service account.
var jwtClient = new google.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key,
  scopes
);

// Use the JWT client to generate an access token.
let routesPromise = new Promise((resolve, reject) => {
  jwtClient.authorize((error, tokens) => {
    let routes = [];

    if (error) return error;
    else {
      axios
        .get(
          process.env.NUXT_ENV_DATABASE_URL +
            "/recipes.json?access_token=" +
            tokens.access_token
        )
        .then(response => {
          Object.keys(response.data).forEach(key => {
            routes.push("/recipes/" + key);
          });
          resolve(routes);
        })
        .catch(error => {
          reject(error);
        });
    }
  });
});

export default {
  mode: "spa",
  generate: {
    fallback: true,

    routes: function(callback) {
      routesPromise
        .then(routes => {
          callback(null, routes);
        })
        .catch(callback);
    }
  },

  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Roboto&display=swap"
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: ["~/assets/scss/main.scss"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/globalComponents.js",
    "~/plugins/firebase.js",
    "~/plugins/fireauth.js"
  ],

  router: {
    middleware: "router-auth",
    linkExactActiveClass: "active-link",
    routes: [
      {
        name: "index",
        path: "/",
        component: "pages/index.vue"
      },
      {
        name: "recipes",
        path: "/recipes",
        component: "pages/recipes.vue",
        children: [
          {
            name: "recipe",
            path: "/recipes/:recipe?",
            component: "pages/recipes/_recipe.vue"
          }
        ]
      },
      {
        name: "login",
        path: "/login",
        component: "pages/login.vue"
      },
      {
        name: "account",
        path: "/account",
        component: "pages/account.vue"
      }
    ]
  },

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [["nuxt-svg-loader", "@nuxtjs/dotenv", "@nuxtjs/svg"]],
  env: {
    baseURL: process.env.NUXT_ENV_BASE_URL || "http://localhost:3000",
    apiKey: process.env.NUXT_ENV_API_KEY,
    authDomain: process.env.NUXT_ENV_AUTH_DOMAIN,
    databaseURL: process.env.NUXT_ENV_DATABASE_URL,
    projectId: process.env.NUXT_ENV_PROJECT_ID,
    storageBucket: process.env.NUXT_ENV_STORAGE_BUCKET,
    messagingSenderId: process.env.NUXT_ENV_MESSAGING_SENDER_ID,
    appId: process.env.NUXT_ENV_APP_ID,
    measurementId: process.env.NUXT_ENV_MEASUREMENT_ID,
    privateKeyId: process.env.NUXT_ENV_PRIVATE_KEY_ID,
    privateKey: process.env.NUXT_ENV_PRIVATE_KEY,
    clientEmail: process.env.NUXT_ENV_CLIENT_EMAIL,
    clientId: process.env.NUXT_ENV_CLIENT_ID,
    authURI: process.env.NUXT_ENV_AUTH_URI,
    tokenURI: process.env.NUXT_ENV_TOKEN_URI,
    authProviderCertURL: process.env.NUXT_ENV_AUTH_PROVIDER_CERT_URL,
    clientCertURL: process.env.NUXT_ENV_CLIENT_CERT_URL
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.node = {
        fs: "empty"
      };
    }
  }
};
