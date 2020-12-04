<template>
  <div class="share-form-container">
    <div id="fb-root"></div>
    <div class="share-form-modal margin-horizontal--large">
      <button
        class="button button--cancel button--cancel-dynamic flex-align-self--end"
        @click="$emit('close-modal')"
      >
        ✕
      </button>
      <h3>{{ $t("recipes.share.share") }} '{{ recipeTitle }}'</h3>
      <div
        v-if="recipePublic"
        class="fb-share-button"
        data-lazy="true"
        :data-href="`https://kokebokami.com/recipes/${recipeKey}/`"
        data-layout="button"
        data-size="large"
      >
        <a
          target="_blank"
          :href="
            `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fkokebokami.com%2Frecipes%2F${recipeKey}%2F&amp;src=sdkpreparse`
          "
          class="fb-xfbml-parse-ignore"
          >{{ $t("recipes.share.shareOnFb") }}</a
        >
      </div>
      <form
        v-if="user && user.id"
        class="share-form margin-vertical--large"
        @submit.prevent
      >
        <div class="flex-row flex-row--align-center flex-row--nowrap">
          <h4 class="margin-bottom--small">
            {{ $t("recipes.share.shareWithFollower") }}
          </h4>
          <hover-info-box class="margin-left--small margin-bottom--small">
            {{ $t("recipes.share.shareWithFollowerNote") }}
          </hover-info-box>
        </div>
        <fieldset class="flex-row margin-bottom--medium">
          <label class="share-form__followers">
            <select-component
              class="share-form__select margin-top--medium margin-right--medium"
              :options="followerNames"
              defaultValue="Select a user"
              @select="option => (selected = option)"
            />
          </label>
        </fieldset>
        <button
          @click="shareRecipe"
          class="button button--xsmall margin-left--xsmall"
        >
          {{ $t("recipes.share.share") }}
        </button>
      </form>

      <form class="share-form margin-vertical--large" @submit.prevent>
        <div v-if="sharedByEmail === false" class="flex-center-container">
          <span class="simple-loading-spinner" />
        </div>
        <fieldset v-if="sharedByEmail === null">
          <h4 class="margin-bottom--small">
            {{ $t("recipes.share.shareByEmail") }}
          </h4>
          <label class="flex-column">
            <input
              id="shareEmail"
              type="email"
              :placeholder="$t('dummyEmail')"
            />
            <button
              @click="shareRecipeByEmail"
              class="button button--xsmall margin-left--xsmall margin-top--medium"
            >
              {{ $t("recipes.share.share") }}
            </button>
          </label>
        </fieldset>
      </form>
      <div class="system-message margin-top--large">{{ systemMessage }}</div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import ClickOutside from "vue-click-outside";
import user from "~/mixins/user.js";
import allUsers from "~/mixins/allUsers.js";
import connectedUsers from "~/mixins/connectedUsers.js";
import ExpandTransition from "~/components/Transitions/Expand.vue";
import SelectComponent from "~/components/Input/SelectComponent.vue";
import HoverInfoBox from "~/components/HoverInfoBox.vue";

export default {
  name: "share-form",
  components: {
    ExpandTransition,
    SelectComponent,
    HoverInfoBox
  },
  mixins: [user, allUsers, connectedUsers],
  data() {
    return {
      searchTerm: "",
      selected: "",
      sharedByEmail: null,
      email: "",
      systemMessage: ""
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
    },
    recipePublic: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    followerNames() {
      return this.followers.map(follower => {
        return follower[1].displayName;
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

      if (this.validateEmail(email)) {
        this.sharedByEmail = false;
        let message = `<p>
          <br>Someone shared a recipe with you:
          <br>Check it out: <a href="https://kokebokami.com/recipes/${this.recipeKey}">'${this.recipeTitle}'</a>.
          <br>
          <br>Best wishes,
          <br>Your Kokebokami team 👩‍🍳</p>`;
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
            this.sharedByEmail = null;
            this.systemMessage =
              "Something went wrong while attempting to send e-mail. Please try again later, or contact us if the issue continues.";
            console.log("Error in api call:", error);
          });
      }
    },
    shareRecipe() {
      const componentThis = this;
      const selectedDisplayName = this.selected;
      const recipeKey = this.recipeKey;
      const sharesRef = this.$fireDb.ref(`recipes/${recipeKey}/sharedWith`);

      let followers = this.followers;
      let selectedFollower = followers.filter(follower => {
        return follower[1].displayName === selectedDisplayName;
      })[0];

      if (!selectedFollower) {
        this.systemMessage = "This user does not exist in the database";
        return;
      }

      let selectedFollowerID = selectedFollower[0];
      let username = selectedFollower[1].displayName;
      let emailNotificationsOff = selectedFollower[1].notifications && selectedFollower[1].notifications.recipe;

      sharesRef.once("value", snapshot => {
        if (snapshot.exists()) {
          let shares = Object.values(snapshot.val());
          if (shares.indexOf(selectedFollowerID) > -1) {
            this.systemMessage = `This recipe is already shared with ${username}`;
            return;
          }
        }
        sharesRef
          .push(selectedFollowerID)
          .then(() => {
            if (!emailNotificationsOff) {
              this.sendNotificationEmail({
                displayName: username,
                id: selectedFollowerID
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
      let message = `<p>Hi ${receiver.displayName},
          <br>
          <br>You just received a recipe from ${this.user.displayName}.
          <br>'${this.recipeTitle}' is now available in your cookbook.
          <br>
          <br>Login to <a href="https://kokebokami.com">Kokebokami</a> to check it out!
          <br>
          <br>Best wishes,
          <br>Your Kokebokami team 👩‍🍳</p>`;
      axios
        .post("/api/send-email", {
          receiverID: receiver.id,
          subject: `${this.user.displayName} just shared a recipe with you 📝`,
          message
        })
        .catch(error =>
          console.log("Error sending notification email:", error)
        );
    },
    facebookPlugin() {
      (function(d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src =
          "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    }
  },
  mounted() {
    this.facebookPlugin();
  },
  directives: {
    ClickOutside
  }
};
</script>
