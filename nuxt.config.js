// TODO: Implement SSL redirect
import path from 'path'

import { defineNuxtConfig } from "nuxt/config";
// console.log("PATH:", import.meta.resolve("~/assets/scss/main.scss"))
export default defineNuxtConfig({
  ssr: true,
  pages: true,
  components: [
    {
      path: "~/components",
      pathPrefix: false
    }
  ],
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
        hid: "keywords",
        name: "keywords",
        content:
          "save recipes, manage recipes, online recipes, recipes, online cookbook, shopping lists, share recipes"
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

  plugins: [
    "~/plugins/router-auth.client.js",
    "~/plugins/firebase.js"
  ],

  router: {
    middleware: ["router-auth"],
  },

  pageTransition: "fade",

  modules: [
    // [
      // "@nuxtjs/google-gtag",
      // {
        //   id: process.env.GOOGLE_PROPERTY_ID
        // }
      // ],
      // [
    //   "@nuxtjs/google-analytics",
    //   {
    //     id: "UA-108483738-5"
    //   }
    // ],
    "nuxt-vuefire",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "nuxt-svgo-loader",
    "@vesp/nuxt-fontawesome"
  ],

  svgoLoader: {
    // Options here will be passed to `vite-svg-loader`
  },

  i18n: {
    locales: ["en", "no"],
    defaultLocale: "en",
    vueI18n: "~/i18n/i18n.config.js",
  },

  vuefire: {
    auth: {
      enabled: true,
    },
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
    // services: {
    //   auth: {
    //     persistence: "local",
  
    //     // it is recommended to configure either a mutation or action but you can set both
    //     initialize: {
    //       onAuthStateChangedAction: "ON_AUTH_STATE_CHANGED"
    //     },
    //     ssr: false
    //   },
    //   database: true,
    //   storage: true
    // },
    // terminateDatabasesAfterGenerate: true
  },

  pwa: {},

  fontawesome: {
    component: "fa",
    icons: {
      regular: ['faStar', 'faClock'],
      solid: ['faSlidersH', 'faStar', 'faSearch'],
      brands: ['faFacebookSquare', 'faFacebookF']
    }
  },

  // vite: {
  //   css: {
  //     preprocessorOptions: {
  //       scss: {
  //         // api: "modern-compiler",
  //         additionalData: '@use "~/assets/scss/settings/variables.settings.scss" as *;',
  //       },
  //     },
  //   },
  // },
  compatibilityDate: "2025-01-10"
});