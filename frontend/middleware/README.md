# MIDDLEWARE

## router-auth.js

Router-auth makes sure all admin pages are protected, and redirects unauthenticated users who try to access admin-routes to `/login`.

It also redirects users who recently logged in to `/account`, unless their e-mail address is not verified.

In the case of an unverified e-mail address, the user is redirected to `/verify-email`.

## Nuxt.js middleware docs

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/routing#middleware).
