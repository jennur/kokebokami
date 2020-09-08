require("dotenv").config();
const getRoutes = require("./build-helpers/getRoutes");
const redirectSSL = require("redirect-ssl");

export default {
  mode: "universal",
  generate: {
    fallback: true,
    routes() {
      return getRoutes();
    }
  },

  // Headers of the page
  head: {
    title: "Kokebokami",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      },
      {
        hid: "title",
        name: "title",
        content: "Kokebokami"
      },
      {
        hid: "og:title",
        property: "og:title",
        content: "Kokebokami"
      },
      {
        hid: "og:url",
        property: "og:url",
        content: `https://kokebokami.com/`
      },
      {
        hid: "og:type",
        property: "og:type",
        content: "website"
      },
      {
        hid: "og:image",
        property: "og:image",
        content:
          "https://firebasestorage.googleapis.com/v0/b/kokebokami-e788f.appspot.com/o/images%2Fglobals%2Fkokebokami-assets%2FlogoK.png?alt=media&token=d0a53dcc-a160-4384-a3e4-2910943e3d06"
      },
      {
        property: "fb:app_id",
        content: "1354921524668944"
      }
    ],
    link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }]
  },

  // Customize the progress-bar color
  loading: { color: "#ff7300" },

  // Global CSS
  css: ["~/assets/scss/main.scss"],
  plugins: ["~/plugins/globalComponents.js", "~/plugins/router-auth.client.js"],
  vendor: ["axios", "babel-polyfill"],
  router: {
    middleware: "router-auth",
    linkExactActiveClass: "active-link"
  },
  pageTransition: "fade",
  // Nuxt.js dev-modules
  babel: {
    presets: ["es2015", "stage-0"],
    plugins: [
      [
        "transform-runtime",
        {
          polyfill: true,
          regenerator: true
        }
      ]
    ]
  },
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

  // Nuxt.js modules
  modules: [
    "@nuxtjs/firebase",
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    "nuxt-svg-loader",
    "@nuxtjs/dotenv",
    "@nuxtjs/sitemap",
    "nuxt-fontawesome"
    /* [
      "nuxt-i18n",
      {
        locales: [
          {
            name: "Norsk",
            code: "no",
            iso: "no-NO",
            file: "no-NO.js"
          },
          {
            name: "English",
            code: "en",
            iso: "en-US",
            file: "en-US.js"
          }
        ],
        langDir: "lang/",
        defaultLocale: "en"
      }
    ] */
  ],
  serverMiddleware: [
    redirectSSL.create({
      enabled: process.env.NODE_ENV === "production"
    }),
    "~/modules/redirectToTrailingSlash.js",
    "~/api/send-email.js"
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
          onAuthStateChangedAction: "ON_AUTH_STATE_CHANGED"
        },
        ssr: false
      },
      realtimeDb: true,
      storage: true
    }
  },
  pwa: {},
  sitemap: {
    path: "/sitemap.xml",
    generate: false,
    hostname: "https://kokebokami.com",
    gzip: true,
    exclude: [
      "/account",
      "/account/*",
      "/verify-email",
      "/cooks/*",
      "/goodbye",
      "/recipes",
      "/no-access"
    ],
    routes() {
      return getRoutes();
    }
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
    privateKeyId: process.env.PRIVATE_KEY_ID,
    privateKey: process.env.PRIVATE_KEY,
    clientEmail: process.env.CLIENT_EMAIL,
    clientId: process.env.CLIENT_ID,
    authURI: process.env.AUTH_URI,
    tokenURI: process.env.TOKEN_URI,
    authProviderCertURL: process.env.AUTH_PROVIDER_CERT_URL,
    clientCertURL: process.env.CLIENT_CERT_URL
  },

  // Build configuration
  build: {
    // You can extend webpack config here
    /*  extend(config, ctx) {
      config.node = {
        fs: "empty",
        child_process: "empty",
        net: "empty",
        tls: "empty",
        dns: "empty"
      };
    } */
  }
};
