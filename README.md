# Kokebokami 🧡

> This is an online cookbook service built with Nuxt.js and Firebase. The site is hosted on heroku.com. Follow the instructions below to get started for developing on your local server.

## Clone this repository ⬇️

Clone the repo into whatever folder you like on your computer from your terminal:

`git clone git@github.com:jennur/kokebokami.git`

## Create your own branch

To prevent the app from breaking in production `(master)`, please create a new branch where you can knock yourself out:

`git branch new_branch_name`

`git checkout new_branch_name`

## Navigate to frontend 🎨

Sanity is installed in this project (just in case of future needs). It is still not in use, so simply ignore this folder for now and navigate to the frontend folder - all the magic happens in there.

## Add environment variables ⚠

For everything to work, you need the environment variables. Log in to heroku.com to get the env-variables from the kokebokami-app `(Settings > Config Vars)`. Add the variables to a new .env file in the root folder (frontend) as in the .env.example file. **Do not edit the .env.example**, this file is only to show you how to list the variables. Make sure to **never push the .env file, or the values, to the repository** (.env should already be listed in .gitignore, but always double check).

## Install dependencies ⚙️

Run `npm install` to install all dependencies necessary for the project to run.

## Serve with hot reload at localhost:3000 🖌

You should now be all set to start developing. Simply run `npm run dev` and go to `localhost:3000` in your web browser to follow the changes you make.

## Push your changes & create a PR 🕵️

When you're done developing your awesome feature, push the changes **to your own branch**, _not master_, and create a pull request to master for another developer to review.

## When PR is merged 🚂

When the pull request is reviewed and approved, it can be merged to master. Once merged, an automatic deploy happens at heroku, and it will soon be visible at `https://kokebokami-staging.herokuapp.com`.

## Test the app in the staging environment 🕵🏼‍♀️🕵️‍♂️

Once deployed to staging, make sure to click around and see if your changes caused any errors and that your feature is working correctly. Preferably make someone else test it with you to make sure nothing is broken.

## Deploy to production 🎉

When assured that everything works, go to heroku and do a manual deploy of the `kokebokami` app in production:

`kokebokami > Deploy > Manual deploy > Choose a branch to deploy > master > Deploy branch`

Soon you will see your new feature at `https://kokebokami.com` 🎉

## Check out the Nuxt.js docs

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
