<template>
  <modal-box :dark-bg="false" :open="open" @close="$emit('close-modal')">
      <h3>{{ $t("recipes.share.share") }} '{{ recipeTitle }}'</h3>

      <form v-if="user && user.id" class="share-form margin-vertical-lg" @submit.prevent >
        <div class="flex-row flex-row--align-center flex-row--nowrap">
          <h4 class="margin-bottom-sm">
            {{ $t("recipes.share.shareWithFollower") }}
          </h4>
        </div>

        <fieldset class="flex-row margin-bottom-md">
          <label class="share-form_followers">
            <select-component
              class="share-form_select margin-top-md margin-right-md"
              :options="followerNames"
              defaultValue="Select a user"
              @select="option => (selected = option)"
            />
          </label>
        </fieldset>

        <div class="flex-row flex-row--align-center">
          <button @click="shareRecipe" class="button button-xs margin-left-xs margin-right-md">
            {{ $t("recipes.share.share") }}
          </button>
          <span v-if="!useEmail" class="link small-text" @click="useEmail = true">
            {{$t("recipes.share.iWantToEnterEmail")}}
          </span>
        </div>
      </form>

      <!--  Share by email  -->
      <expand-transition :show="useEmail">
        <form class="share-form margin-vertical-lg" @submit.prevent>
          <div v-if="sharedByEmail === false" class="flex-center-container">
            <span class="simple-loading-spinner" />
          </div>

          <fieldset v-if="sharedByEmail === null">
            <h4 class="margin-bottom-sm">
              {{ $t("recipes.share.shareByEmail") }}
            </h4>
            <label class="flex-column">
              <input id="shareEmail" type="email" :placeholder="$t('dummyEmail')"/>
              <button @click="shareRecipeByEmail" class="button button-xs margin-left-xs margin-top-md">
                {{ $t("recipes.share.share") }}
              </button>
            </label>
          </fieldset>
        </form>
      </expand-transition>

      <div class="system-message margin-top-lg">{{ systemMessage }}</div>
  </modal-box>
</template>
<script>
import axios from "axios";
import ClickOutside from "vue-click-outside";

import { anonymousTemplate, kokebokamiUsersTemplate } from "~/helpers/email-templates";

import user from "~/mixins/user.js";
import connectedUsers from "~/mixins/followed-and-followers.js";

import ExpandTransition from "~/components/Transitions/Expand.vue";
import SelectComponent from "~/components/Input/SelectComponent.vue";
import HoverInfoBox from "~/components/HoverInfoBox.vue";
import ModalBox from "~/components/ModalBox";

export default {
  name: "share-form",
  components: {
    ModalBox,
    ExpandTransition,
    SelectComponent,
    HoverInfoBox
  },
  mixins: [user, connectedUsers],
  data() {
    return {
      searchTerm: "",
      selected: "",
      sharedByEmail: null,
      email: "",
      systemMessage: "",
      useEmail: false
    };
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    recipeKey: {
      type: String,
      default: null
    },
    recipeOwnerID: {
      type: String,
      default: null
    },
    recipeTitle: {
      type: String,
      default: ""
    },
    recipeDescription: {
      type: String,
      default: ""
    }
  },
  computed: {
    followerNames() {
      return this.followers.map(follower => {
        return follower.displayName;
      });
    }
  },
  methods: {
    validateEmail(email) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      let validated = 1;

      if (!email.match(emailRegex)) {
        validated = validated * 0;
        this.systemMessage = this.$t("enterValidEmailAddress");
        return false;
      } else {
        this.systemMessage = "";
        return true;
      }
    },
    shareRecipeByEmail() {
      let email = document.getElementById("shareEmail").value;
      let path = this.$route.fullPath;

      if (this.validateEmail(email)) {
        this.sharedByEmail = false;
        let message = anonymousTemplate(path, this.recipeTitle);
        axios
          .post("/api/send-email", {
            email,
            subject: `Someone just shared a recipe with you 📝`,
            message
          })
          .then(() => {
            this.sharedByEmail = true;
            this.systemMessage = "E-mail was sent";
          })
          .catch(error => {
            console.log("Error sending email:", error);
            this.sharedByEmail = null;
            this.systemMessage = `Something went wrong while attempting to send e-mail.
                                  Please try again later, or contact us if the issue continues`;
          });
      }
    },
    shareRecipe() {
      const selectedDisplayName = this.selected;
      const recipeKey = this.recipeKey;
      const sharesRef = this.$fire.database.ref(`recipes/${recipeKey}/sharedWith`);

      let followers = this.followers;
      let selectedFollower = followers.filter(follower => {
        return follower.displayName === selectedDisplayName;
      })[0];

      if (!selectedFollower) {
        this.systemMessage = "This user does not exist in the database";
        return;
      }

      let username = selectedFollower.displayName;
      let dontSend = selectedFollower.notificationsOff && selectedFollower.notificationsOff.recipe;

      sharesRef.once("value", snapshot => {
        if (snapshot.exists()) {
          let shares = Object.values(snapshot.val());
          if (shares.indexOf(selectedFollower.id) > -1) {
            this.systemMessage = `This recipe is already shared with ${username}`;
            return;
          }
        }
        sharesRef
          .push(selectedFollower.id)
          .then(() => {
            if (!dontSend) {
              this.sendNotificationEmail({
                displayName: username,
                id: selectedFollower.id
              });
            }
          })
          .catch(error =>
            console.log("Error while sharing recipe:", error.message)
          );
        this.systemMessage = `Successfully shared with ${username}`;
      });
    },
    sendNotificationEmail(receiver) {
      let sender = this.user.displayName;
      let path = this.$route.fullPath;
      let message = kokebokamiUsersTemplate(receiver.displayName, sender, path, this.recipeTitle);
      axios.post("/api/send-email", {
          receiverID: receiver.id,
          subject: `${sender} just shared a recipe with you 📝`,
          message
          })
          .catch(error =>
            console.log("Error sending notification email:", error)
          );
    },
  },
  directives: {
    ClickOutside
  }
};
</script>
