require("dotenv").config();

export default {
  mode: "universal",
  generate: {
    fallback: true
  },
  /*
   ** Headers of the page
   */
  head: {
    title: "Kokebokami",
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
  loading: { color: "#ff7300" },
  /*
   ** Global CSS
   */
  css: ["~/assets/scss/main.scss"],
  /*
   ** Plugins to load before mounting the App
   */
  serverMiddleware: [
    // Will register redirect-ssl npm package
    /*     'redirect-ssl',
     */
    { path: "/api/page-scraper", handler: "~/api/pageScraper.js" }
  ],
  plugins: [
    "~/plugins/globalComponents.js",
    { src: "~/plugins/firebase.js", mode: "client" },
    { src: "~/plugins/fireauth.js", mode: "client" }
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
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    ["nuxt-svg-loader", "@nuxtjs/dotenv", "@nuxtjs/svg"],
    [
      "@nuxtjs/sitemap",
      {
        path: "/sitemap.xml",
        generate: false
      }
    ],
    [
      "nuxt-fontawesome",
      {
        component: "fa",
        imports: [
          {
            set: "@fortawesome/free-brands-svg-icons",
            icons: ["fab"]
          }
        ]
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
  },
  pwa: {}
};
