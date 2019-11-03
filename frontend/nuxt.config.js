require("dotenv").config();

export default {
  mode: "spa",
  generate: {
    fallback: true
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
      { rel: "icon", type: "image/png", href: "/favicon.png" },
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
      { name: "sign-up", path: "/sign-up", component: "pages/sign-up.vue" },
      {
        name: "account",
        path: "/account",
        component: "pages/account/index.vue",
        children: [
          {
            name: "my-recipes",
            path: "/account/my-recipes",
            component: "pages/account/my-recipes.vue"
          },
          {
            name: "add-recipe",
            path: "/account/add-recipe",
            component: "pages/account/add-recipe.vue"
          },
          {
            name: "goodbye",
            path: "/account/goodbye",
            component: "pages/goodbye.vue"
          }
        ]
      },

      {
        name: "cookies-policy",
        path: "/cookies-policy",
        component: "pages/cookies-policy.vue"
      }
    ]
  },

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    [
      "@nuxtjs/google-gtag",
      {
        id: process.env.GOOGLE_PROPERTY_ID
      }
    ],
    [
      "@nuxtjs/google-analytics",
      {
        id: "UA-108483738-5"
      }
    ]
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    ["nuxt-svg-loader", "@nuxtjs/dotenv", "@nuxtjs/svg"],
    [
      "@nuxtjs/sitemap",
      {
        path: "/sitemap.xml",
        generate: false
      }
    ]
  ],
  sitemap: {
    hostname: "https://kokebokami.com",
    gzip: true,
    exclude: ["/account", "/account/**", "/recipes"],
    routes: ["/", "/login", "/sign-up", "/cookies-policy"]
  },
  env: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
    privateKeyId: process.env.PRIVATE_KEY_ID,
    privateKey: process.env.PRIVATE_KEY,
    clientEmail: process.env.CLIENT_EMAIL,
    clientId: process.env.CLIENT_ID,
    authURI: process.env.AUTH_URI,
    tokenURI: process.env.TOKEN_URI,
    authProviderCertURL: process.env.AUTH_PROVIDER_CERT_URL,
    clientCertURL: process.env.CLIENT_CERT_URL
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
