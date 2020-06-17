<template>
  <div class="dropdown-menu">
    <span class="pointer"></span>
    <ul>
      <li
        class="dropdown-menu__link-wrap margin-bottom--large"
        v-for="link in links"
        :key="`link-${link.title}`"
      >
        <component class="dropdown-menu__icon" v-if="link.icon" :is="link.icon" />
        <nuxt-link
          class="dropdown-menu__link"
          :to="link && link.path"
          @click.native="$emit('close')"
        >
          {{
          link.title
          }}
        </nuxt-link>
      </li>
      <li class="margin-top--xlarge margin--auto">
        <button class="logout-button" @click="$emit('logout')">Log out</button>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "dropdown-menu",
  props: {
    links: {
      type: Array,
      default: []
    }
  } /* ,
  created() {
    this.links.map(link => {
      if (link.icon) {
        link.icon = () =>
          import(`../../../../assets/graphics/${link.icon}.svg`);
        return link;
      }
      console.log("Links:", this.links);
    });
  } */
};
</script>
