<template>
  <dt class="account_detail">
    <div class="account_detail-title">
      <h4 class="account_detail-title">
        {{ title }}
        <span class="margin-left-sm">
          {{
          links ? links.length : null
          }}
        </span>
      </h4>
    </div>
    <ol>
      <li v-for="link in links" :key="link.id">
        <div v-if="externalURL">
          <a :href="link && link.url" target="_blank">{{ link.title }}</a>
          <new-tab-icon class="account_recipe-link-icon" />
        </div>
        <div v-else>
          <NuxtLink :to="basePath + link.path">{{ link.title }}</NuxtLink>
          <span class="system-message" v-if="link.public">Public</span>
        </div>
      </li>
    </ol>
  </dt>
</template>
<script>
import newTabIcon from "~/assets/graphics/icons/new-tab-icon.svg";

export default {
  name: "account-link-list",
  components: {
    newTabIcon,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    links: {
      type: Array,
      default: () => [],
    },
    externalURL: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
};
</script>
