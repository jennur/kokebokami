<template>
  <div class="flex-row flex-row--justify-center flex-row--align-center margin-bottom--xlarge">
    <img
      class="profile__img margin-right--xlarge"
      :src="user.photoURL"
      :alt="user.name + '´s profile picture'"
      v-if="user && user.photoURL"
    />
    <div class="profile__biography mobile-width">
      <h2 class="heading--display-font">{{user && user.name ? user.name : ""}}</h2>
      <p>{{user && user.biography ? user.biography : ""}}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "profile-view",
  components: {},
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
