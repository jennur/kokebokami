<i18n>
{
  "en": {
    "welcome": "Welcome to Kokebokami!",
    "pickUsername": "Pick a username",
    "done": "Done!"
  },
  "no": {
    "welcome": "Velkommen til Kokebokami!",
    "pickUsername": "Velg et brukernavn",
    "done": "Ferdig!"
  }
}
</i18n>
<template>
  <section class="username-selector" :class="{'username-selector--open': open}">
    <transition name="pop-modal">
      <div v-if="open" class="username-selector-modal margin-horizontal-md">
        <h3>{{$t("welcome")}}</h3>
        <form class="username-selector-modal-form" v-on:submit.prevent>
          <fieldset>

            <label>
              {{ $t("pickUsername") }}
              <input type="text" v-model="username" required />
            </label>

            <button class="button button-sm button--green" @click="updateUsername">
              {{$t("done")}}
            </button>
          </fieldset>

          <expand-transition :show="!!usernameSystemMessage">
            <div class="system-message system-message--dark-bg margin-top-lg">
              {{ usernameSystemMessage }}
            </div>
          </expand-transition>
        </form>
      </div>
    </transition>
  </section>
</template>

<script>
import user from "~/mixins/user.js";
import validateUsername from "~/mixins/validate-username";
import ExpandTransition from "~/components/Transitions/Expand.vue";

export default {
  name: "username-modal",
  components: {
    ExpandTransition
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      username: "",
      usernameSystemMessage: ""
    }
  },
  mixins: [user, validateUsername],
  methods: {
    setUsernameInStore(username){
      this.$store.dispatch("UPDATE_USERNAME", username);
    },
    async updateUsername() {
      let username = this.username;
      let valid = await this.validateUsername(username);
      if(valid && this.user.id) {
        this.$fire.database
          .ref("/users/" + this.user.id)
          .update({
            displayName: username
          })
          .then(() => {
            this.setUsernameInStore(username);
            this.usernameSystemMessage = "";
          })
          .catch(e => {
            this.usernameSystemMessage = e.message;
            console.log(e);
          });
      }
    },
  }
}
</script>
