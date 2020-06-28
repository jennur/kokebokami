<template>
  <a ref="anchorButton" class="anchor-button" :href="`#${scrollTo}`">
    <downArrow />
  </a>
</template>

<script>
import downArrow from "~/assets/graphics/down-arrow.svg";
export default {
  name: "anchor-button",
  components: {
    downArrow
  },
  props: {
    scrollTo: {
      type: String,
      default: ""
    }
  }
};
</script>
