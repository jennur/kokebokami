# Kokebokami 🧡

> This is an online cookbook service built with Nuxt.js and Firebase. The site is hosted on heroku.com. Follow the instructions below to get started for developing on your local server.

## Clone this repository ⬇️

Clone the repo into whatever folder you like on your computer from your terminal:
`git clone git@github.com:jennur/kokebokami.git`

## Navigate to frontend 🎨

Sanity is installed in this project (just in case of future needs). It is still not in use, so simply ignore this folder for now and navigate to the frontend folder - all the magic happens in there.

## Add environment variables ⚠

For everything to work, you need the environment variables. Log in to heroku.com to get the env-variables from the kokebokami-app (Settings > Config Vars). Add the variables to a new .env file in the root folder (frontend) as in the .env.example file. _Do not edit the .env.example_, this file is only to show you how to list the variables. Make sure to _never_ push the .env file, or the values, to the repository (.env should already be listed in .gitignore, but always double check).

## Install dependencies ⚙️

Run `npm install` to install all dependencies.

# Serve with hot reload at localhost:3000 🖌

You should now be all set to start developing. Simply run `npm run dev` and go to `localhost:3000`. 🎉

## Check out the Nuxt.js docs

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
