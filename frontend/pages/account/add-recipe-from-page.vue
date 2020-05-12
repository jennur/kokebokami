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
        @click.prevent="handleScrape"
        type="submit"
        name="submit"
        value="Load"
        class="add-recipe-form__url-submit"
      />
    </form>
    <div class="scraped-content">
      <div class="system-message margin-top--large">
        {{ systemMessage }}
      </div>
    </div>
  </section>
</template>
<script>
import axios from "axios";
import cheerio from "cheerio";
export default {
  name: "addRecipeFromPage",
  data() {
    return {
      url: "",
      systemMessage: ""
    };
  },
  async fetch() {
    let url = this.url;
    await this.$http.$get(url).then(data => console.log("Data:", data));
  },
  fetchOnServer: false,
  methods: {
    handleScrape() {
      let url = this.$refs.urlInput.value;

      let urlCheck = /(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:\?#[\]@!$&'()*+,;=.]+/;
      console.log("Test::", urlCheck.test(url));
      if (urlCheck.test(url)) {
        console.log("Url:", url);
        this.url = url;
        this.systemMessage = "";
        let data = axios.get(url).then(data => console.log("Data:", data));
      } else {
        console.log("Error in url:", url);
        this.systemMessage = "The URL is not the correct format.";
      }
    }
  }
};
</script>
