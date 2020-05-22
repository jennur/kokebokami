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
    "~/plugins/globalComponents.js"
    /* { src: "~/plugins/firebase.js", mode: "client" },
    { src: "~/plugins/firethis.$fireAuth.js", mode: "client" } */
  ],

  router: {
    middleware: "router-auth",
    linkExactActiveClass: "active-link"
  },
  pageTransition: "fade",
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
    "@nuxtjs/firebase",
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    "nuxt-svg-loader",
    "@nuxtjs/dotenv",
    "@nuxtjs/sitemap",
    "nuxt-fontawesome"
  ],
  firebase: {
    config: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID
    },
    services: {
      auth: {
        persistence: "local",

        // it is recommended to configure either a mutation or action but you can set both
        initialize: {
          onAuthStateChangedMutation: "onAuthStateChanged",
          onAuthStateChangedAction: "ON_AUTH_STATE_CHANGED"
        },

        ssr: false
      },
      //firestore: false,
      //functions: false,
      //storage: false,
      realtimeDb: true,
      //messaging: false,
      //performance: false,
      analytics: true
      //remoteConfig: false
    }
  },
  sitemap: {
    path: "/sitemap.xml",
    generate: false,
    hostname: "https://kokebokami.com",
    gzip: true,
    exclude: ["/account", "/account/**", "/recipes"],
    routes: ["/", "/login", "/sign-up", "/cookies-policy"]
  },
  fontawesome: {
    component: "fa",
    imports: [
      {
        set: "@fortawesome/free-brands-svg-icons",
        icons: ["fab"]
      }
    ]
  },
  env: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    /* apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID, */
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
