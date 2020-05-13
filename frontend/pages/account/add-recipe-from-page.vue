<template>
  <section class="container container--center tablet-width margin-top--xxlarge">
    <form class="add-recipe-form--url flex-row margin--auto">
      <input
        ref="urlInput"
        type="text"
        name="url"
        id="url"
        placeholder="https://url-to-the-recipe.com"
        class="add-recipe-form__url"
      />
      <input
        @click.prevent="$fetch"
        type="submit"
        name="submit"
        value="Load"
        class="add-recipe-form__url-submit"
      />
    </form>
    <div class="scraped-content">
      <div v-if="clicked && $fetchState.pending">Loading content ..</div>
      <div v-if="content">{{ content }}</div>
      <div class="system-message margin-top--large">
        {{ systemMessage }}
      </div>
    </div>
  </section>
</template>
<script>
import axios from "axios";
import cheerio from "cheerio";
/* import puppeteer from "puppeteer";
 */ export default {
  name: "addRecipeFromPage",
  data() {
    return {
      clicked: false,
      content: "",
      systemMessage: ""
    };
  },
  async fetch() {
    let url = this.$refs.urlInput.value;
    let urlCheck = /(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:\?#[\]@!$&'()*+,;=.]+/;
    console.log("Test::", urlCheck.test(url));
    if (urlCheck.test(url)) {
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        /*         await page.waitForSelector(".category", { timeout: 1000 });
         */
        const body = await page.evaluate(() => {
          return document.querySelector("body").innerHTML;
        });
        console.log(body);

        await browser.close();
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Error in url:", url);
    }
    /* let url = this.$refs.urlInput.value;
    let urlCheck = /(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:\?#[\]@!$&'()*+,;=.]+/;
    console.log("Test::", urlCheck.test(url));
    if (urlCheck.test(url)) {
      this.clicked = true;
      console.log("Url:", url);
      this.systemMessage = "";
      let content = await axios
        .get(`https://cors-anywhere.herokuapp.com/${url}`)
        .then(result => {
          console.log("Data:", result.data);
          this.handleContent(result.data);
        })
        .catch(error => {
          console.log("Error::", error);
          this.systemMessage = error.message;
        });
      console.log("Content:", content);
    } else {
      console.log("Error in url:", url);
      this.systemMessage = "The URL is not the correct format.";
    } */
  },
  fetchOnServer: false,
  methods: {
    handleContent(content) {
      let $ = cheerio.load(content);
      let body = $("body");
      this.content = body.html();
      console.log("Body:", body);
    }
  }
};
</script>
