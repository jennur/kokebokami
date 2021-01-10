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

          <expand-transition :show="!!systemMessage">
            <div class="system-message system-message--dark-bg margin-top-lg">
              {{ systemMessage }}
            </div>
          </expand-transition>
        </form>
      </div>
    </transition>
  </section>
</template>

<script>
import user from "~/mixins/user.js";
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
      systemMessage: ""
    }
  },
  mixins: [user],
  methods: {
    validateUsername(username) {
      let usernameRegex = /^[a-zA-Z\s]+$/;
      if(!usernameRegex.test(username)) {
        this.systemMessage = "Username can only consist of letters and spaces";
        return false;
      }
      return true;
    },
    setUsernameInStore(username){
      this.$store.dispatch("UPDATE_USERNAME", username);
    },
    updateUsername() {
      let username = this.username;

      if(this.validateUsername(username) && this.user.id) {
        this.$fire.database
          .ref("/users/" + this.user.id)
          .update({
            displayName: username
          })
          .then(() => {
            this.setUsernameInStore(username);
            this.systemMessage = "";
          })
          .catch(e => {
            this.systemMessage = e.message;
            console.log(e);
          });
      }
    },
  }
}
</script>
