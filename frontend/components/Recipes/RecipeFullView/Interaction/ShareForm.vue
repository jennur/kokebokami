<template>
  <div class="share-form-container">
    <expand-transition :show="open">
      <form class="share-form" v-on:submit.prevent>
        <h4>Share with one of your followers</h4>
        <p class="margin-top--none margin-bottom--large">
          The recipe will show up under your friend's "Recipes shared with me"
          tab in his/hers cookbook.
        </p>
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
        <button @click="shareRecipe" class="button button--small">Share</button>
      </form>
      <div class="system-message margin-top--large">{{ systemMessage }}</div>
    </expand-transition>
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

export default {
  name: "share-form",
  components: {
    ExpandTransition,
    SelectComponent
  },
  mixins: [user, allUsers, connectedUsers],
  data() {
    return {
      searchTerm: "",
      selected: "",
      shareByEmail: false,
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
      let emailNotificationsOff = selectedFollower[1].emailNotificationsOff;
      let userEmail = selectedFollower[1].email;

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
              this.sendEmail({
                displayName: username,
                email: userEmail
              });
            }
          })
          .catch(error =>
            console.log("Error while sharing recipe:", error.message)
          );
        this.systemMessage = `Successfully shared with ${username}`;
      });
    },
    sendEmail(receiver) {
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
          email: receiver.email,
          subject: `${this.user.displayName} just shared a recipe with you 📝`,
          message
        })
        .catch(error => console.log("Error:", error));
    }
  },
  directives: {
    ClickOutside
  }
};
</script>
