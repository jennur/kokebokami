<template>
  <dt class="account__detail">
    <div class="account__detail-title">
      <h4>
        {{title}}
        <span>{{ links ? links.length : null }}</span>
      </h4>
    </div>
    <ol>
      <li v-for="link in links" :key="link[1].title">
        <div v-if="externalURL">
          <a :href="link[1] && link[1].url" target="_blank">
            {{
            link[1].title
            }}
          </a>
          <new-tab-icon class="account__recipe-link-icon" />
        </div>
        <div v-else>
          <nuxt-link :to="basePath + link[0]">
            {{
            link[1].title
            }}
          </nuxt-link>
          <span class="system-message" v-if="link[1].public">Public</span>
        </div>
      </li>
    </ol>
  </dt>
</template>
<script>
import newTabIcon from "~/assets/graphics/new-tab-icon.svg";

export default {
  name: "account-link-list",
  components: {
    newTabIcon
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    links: {
      type: Array,
      default: () => []
    },
    externalURL: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ""
    }
  }
};
</script>
