<template>
  <div class="padding--large">
    <h4 class="margin-top--xxlarge">Give feedback on this recipe</h4>
    <div id="disqus_thread"></div>
    <noscript>
      Please enable JavaScript to view the
      <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>
    </noscript>
  </div>
</template>

<script>
export default {
  name: "comments",
  props: {
    path: { type: String, default: "/" }
  },
  mounted() {
    var disqus_config = function() {
      this.page.url = this.path;
      this.page.identifier = "Kokebokami";
    };
    (function() {
      // DON'T EDIT BELOW THIS LINE
      var d = document,
        s = d.createElement("script");
      s.src = "https://kokebokami.disqus.com/embed.js";
      s.setAttribute("data-timestamp", +new Date());
      (d.head || d.body).appendChild(s);
    })();
  }
};
</script>
