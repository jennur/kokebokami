# PLUGINS

## globalComponents.js

This file registers selected components globally. If a component is registered in this file, it is ready for use anywhere in the app without a local import. Unless a component is frequently used, there is no need to register the component globally.

## router-auth.client.js

Router-auth makes sure the router-auth _middleware_ script runs client-side upon page load, as the middleware runs server-side on page load, and client side on navigation.

## Nuxt.js plugin docs

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/plugins).
