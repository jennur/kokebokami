"use strict";
const express = require("express");
const app = express();
const axios = require("axios");

app.use(express.json());

app.get("/", async (req, res) => {
  let images = await axios
    .get(
      `https://${process.env.PROJECT_ID}.firebaseio.com/recipes.json?auth=${process.env.DATABASE_SECRET}`
    )
    .then(recipes => {
      return Object.entries(recipes.data)
        .filter(recipe => recipe[1].public)
        .map(recipe => {
          let photoURL =
            recipe[1].photoURL ||
            "https://firebasestorage.googleapis.com/v0/b/kokebokami-e788f.appspot.com/o/images%2Fglobals%2FrecipeImage%2Frecipe-backup-img.png?alt=media&token=67cb87a6-78ae-4b45-bdec-44b8e702b842";
          photoURL = photoURL.replace(/&/g, "&amp;");
          return `<url>
                    <loc>https://kokebokami.com/recipes/${recipe[0]}/</loc>
                      <image:image>
                        <image:loc>${photoURL}</image:loc>
                      </image:image>
                  </url> `;
        });
    })
    .catch(error => console.log("Error generating routes:", error.message));
  images = images.join("\n");

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
                  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                          xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
                    ${images}
                  </urlset> `;
  res.set("Content-Type", "text/xml");
  res.send(sitemap);
});

module.exports = {
  path: "/api/image-sitemap",
  handler: app
};
