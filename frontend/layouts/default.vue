<template>
  <div id="layout">
    <navigation />
    <nuxt />
    <footer-component />
    <cookie-consent />
    <script type="text/javascript">
  (function(w, d, v3) {
    w.chaportConfig = {
      appId: "5db40c9d8ee79626e582eb0e"
    };

    if (w.chaport) return;
    v3 = w.chaport = {};
    v3._q = [];
    v3._l = {};
    v3.q = function() {
      v3._q.push(arguments);
    };
    v3.on = function(e, fn) {
      if (!v3._l[e]) v3._l[e] = [];
      v3._l[e].push(fn);
    };
    var s = d.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = "https://app.chaport.com/javascripts/insert.js";
    var ss = d.getElementsByTagName("script")[0];
    ss.parentNode.insertBefore(s, ss);
  })(window, document);
    </script>
  </div>
</template>
<script>
import CookieConsent from "~/components/CookieConsent.vue";
export default {
  name: "default-layout",
  components: {
    CookieConsent
  }
};
</script>


