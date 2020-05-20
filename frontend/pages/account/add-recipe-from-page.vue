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
        @click.prevent="getContent"
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
  /* fetchOnServer: false,
  async fetch() {
    let url = this.$refs && this.$refs.urlInput.value;
    let urlCheck = /(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:\?#[\]@!$&'()*+,;=.]+/;
    console.log("Test::", urlCheck.test(url));
    if (urlCheck.test(url)) {
      console.log("This:", this);
      this.content = await this.$axios
        .$get("/api/page-scraper", { url })
        .then(result => console.log("Result", result))
        .catch(error => console.log("Error:", error));
    } else {
      console.log("Error in url:", url);
    }
  }, */
  methods: {
    handleContent(content) {
      let $ = cheerio.load(content);
      let body = $("body");
      this.content = body.html();
      console.log("Body:", body);
    },
    async getContent() {
      let getUrl = this.$refs.urlInput.value;
      let urlCheck = /(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:\?#[\]@!$&'()*+,;=.]+/;
      console.log("Test::", urlCheck.test(getUrl));
      if (urlCheck.test(getUrl)) {
        await this.$axios
          .$get("/api/page-scraper", { params: { getUrl } })
          .then(result => console.log("Result", result))
          .catch(error => console.log("Error:", error));
      } else {
        console.log("Error in url:", url);
      }
    }
  }
};
</script>
