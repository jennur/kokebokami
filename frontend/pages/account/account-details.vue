<template>
  <div>
    <breadcrumbs :routes="breadcrumbs" />
    <div class="account container tablet-width padding-horizontal--large">
      <h1 class="margin-top--xxlarge margin-bottom--large">
        {{ $t("accountDetails.headline") }}
      </h1>
      <nuxt-link :to="localePath('/account/public-profile-view/')">
        {{ $t("accountDetails.seeYourPublicProfile") }}
        <right-arrow class="icon icon--blue" />
      </nuxt-link>
      <div>
        <h3 class="margin-top--xxlarge">
          {{ $t("accountDetails.personalData") }}
        </h3>
        <dl class="flex-row">
          <account-detail
            :title="$t('accountDetails.profileImage')"
            :systemMessage="
              removeProfileImgSystemMessage || updateProfileImgSystemMessage
            "
            :visibleToPublic="true"
            :editOption="true"
            :removeOption="true"
            @update="value => compressImage(value)"
            @remove="removeProfileImg"
            :currentValue="photoURL"
            :isImage="true"
            :isLoading="isLoading"
          />
          <account-detail
            :title="$t('accountDetails.biography')"
            :systemMessage="biographySystemMessage"
            :visibleToPublic="true"
            :editOption="true"
            inputType="textarea"
            @update="value => updateBiography(value)"
            :currentValue="biography"
          />
          <account-detail
            :title="$t('accountDetails.username')"
            :systemMessage="usernameSystemMessage"
            :visibleToPublic="true"
            :editOption="true"
            autocompleteType="username"
            @update="value => updateUsername(value)"
            :currentValue="username && username.length ? username : 'User'"
          />

          <account-detail
            :systemMessage="emailSystemMessage"
            :visibleToPublic="false"
            :editOption="false"
            :title="$t('accountDetails.email')"
            inputType="email"
            autocompleteType="email"
            @update="value => updateEmail(value)"
            :currentValue="email"
          />
        </dl>

        <h3>{{ $t("accountDetails.recipesConnectedToYourAccount") }}</h3>
        <dl class="flex-row">
          <account-link-list
            :title="`${$t('accountDetails.myRecipes')}:`"
            :links="userRecipes"
            basePath="/recipes/"
          />
          <account-link-list
            :title="`${$t('accountDetails.recipesSharedWithMe')}:`"
            :links="sharedRecipes"
            basePath="/recipes/"
          />
          <account-link-list
            :title="`${$t('accountDetails.myRecipeLinks')}:`"
            :links="recipeLinks"
            :externalURL="true"
          />
        </dl>

        <h3>{{ $t("accountDetails.cooksConnectedToYourAccount") }}</h3>
        <dl class="flex-row">
          <account-link-list
            :title="`${$t('accountDetails.following')}:`"
            :links="cooksFollowed"
            basePath="/cooks/"
          />
          <account-link-list
            :title="`${$t('accountDetails.followers')}:`"
            :links="cookFollowers"
            basePath="/cooks/"
          />
        </dl>
        <dl class="flex-row">
          <h3 class="full-width">
            {{ $t("accountDetails.emailNotifications.headline") }}
          </h3>
          <dt class="full-width account__detail account__detail--flex-column">
            <h4 class="account__detail-title">
              {{ $t("accountDetails.emailNotifications.infoNote") }}
            </h4>
            <div class="flex-row flex-row--align-center">
              <p class="email-notifications margin-right--small">
                {{
                  $t(
                    "accountDetails.emailNotifications.yourEmailNotificationsAre"
                  )
                }}
                <strong
                  class="email-notifications__status"
                  :class="{
                    'color--pink': user.emailNotificationsOff,
                    'color--blue': !user.emailNotificationsOff
                  }"
                  >{{
                    user.emailNotificationsOff ? $t("off") : $t("on")
                  }}</strong
                >
                <toggle-switch
                  :checked="!user.emailNotificationsOff"
                  @toggle="updateEmailNotificationStatus"
                />
              </p>
            </div>
          </dt>
        </dl>
        <dl class="flex-row">
          <h3 class="full-width">
            {{ $t("accountDetails.profileVisibility.headline") }}
          </h3>
          <dt class="full-width account__detail account__detail--flex-column">
            <h4 class="account__detail-title">
              <p>
                {{ $t("accountDetails.profileVisibility.infoNote") }}
              </p>
            </h4>
            <div class="flex-row flex-row--align-center">
              <p class="email-notifications margin-right--small">
                {{ $t("accountDetails.profileVisibility.yourProfileIs") }}
                <strong
                  class="email-notifications__status"
                  :class="{
                    'color--pink': user.hiddenProfile,
                    'color--blue': !user.hiddenProfile
                  }"
                  >{{ user.hiddenProfile ? $t("closed") : $t("open") }}</strong
                >
                <toggle-switch
                  :checked="!user.hiddenProfile"
                  @toggle="updateHiddenProfileStatus"
                />
              </p>
            </div>
          </dt>
        </dl>
        <button
          class="button button--small button--transparent button--transparent-red margin-top--large"
          @click="toggleAlert"
        >
          <delete-icon class="icon margin-right--small" />{{
            $t("accountDetails.deleteMyAccount")
          }}
        </button>
        <p class="system-message">{{ systemMessage }}</p>
      </div>
    </div>
    <Alert
      alertMessage="Are you sure you want to delete your account and all your recipes? This operation cannot be undone."
      :showAlert="showAlert"
      @confirmed="deleteAccount"
      @cancel="toggleAlert"
    />
  </div>
</template>

<script>
const uuid = require("uuid");
import Compressor from "compressorjs";

import user from "~/mixins/user.js";
import allUsers from "~/mixins/allUsers.js";
import connectedUsers from "~/mixins/connectedUsers.js";
import sharedRecipes from "~/mixins/sharedRecipes.js";
import userRecipes from "~/mixins/userRecipes.js";
import userRecipeLinks from "~/mixins/userRecipeLinks.js";

import AccountDetail from "~/components/Account/Displays/AccountDetail.vue";
import AccountLinkList from "~/components/Account/Displays/AccountLinkList.vue";
import Alert from "~/components/Alert.vue";
import ToggleSwitch from "~/components/Input/ToggleSwitch.vue";

export default {
  name: "account-details",
  components: {
    AccountDetail,
    AccountLinkList,
    Alert,
    ToggleSwitch
  },
  head() {
    return {
      title: `Account details | Kokebokami`,
      link: [
        {
          rel: "canonical",
          href: "https://kokebokami.com/account/account-details/"
        }
      ]
    };
  },
  data() {
    return {
      systemMessage: "",
      updateProfileImgSystemMessage: "",
      removeProfileImgSystemMessage: "",
      emailSystemMessage: "",
      usernameSystemMessage: "",
      biographySystemMessage: "",
      photoURL: "",
      username: "",
      email: "",
      biography: "",
      isLoading: false,
      showAlert: false,
      emailNotificationsOff: false,
      hiddenProfile: false
    };
  },
  mixins: [
    user,
    allUsers,
    connectedUsers,
    userRecipes,
    sharedRecipes,
    userRecipeLinks
  ],
  computed: {
    breadcrumbs() {
      return [
        { name: this.$t("navigation.home"), link: "/" },
        { name: this.$t("navigation.myAccount"), link: "/account/" },
        { name: this.$t("navigation.accountDetails") }
      ];
    },
    recipeLinks() {
      let links = this.userRecipeLinks;
      links = links.map(link => {
        link[1].title = link[1].title || this.makeBackupTitle(link[1]);
        return link;
      });
      return links;
    },
    cooksFollowed() {
      let followed = this.followed;
      return followed.map(cook => {
        cook[1].title = cook[1].displayName;
        return cook;
      });
    },
    cookFollowers() {
      let followers = this.followers;
      return followers.map(cook => {
        cook[1].title = cook[1].hiddenProfile ? "User" : cook[1].displayName;
        return cook;
      });
    }
  },
  methods: {
    toggleAlert() {
      this.showAlert = !this.showAlert;
    },
    setProfileImgSystemMessage(message) {
      this.updateProfileImgSystemMessage = message;
    },
    makeBackupTitle(link) {
      let regex = /-/gi;
      let url = link.url;
      let title = url
        .split("/")
        .pop()
        .replace(regex, " ");
      return title;
    },
    updateHiddenProfileStatus(checked) {
      let hiddenProfile = !!this.hiddenProfile;
      if (checked === hiddenProfile) {
        var userRef = this.$fireDb.ref(`users/${this.user.id}`);
        userRef
          .update({ hiddenProfile: !checked })
          .then(() => {
            console.log("Successfully updated hidden profile status");
            this.updateUserDetailsInStore();
            this.hiddenProfile = !checked;
          })
          .catch(error =>
            console.log("Error updating hidden profile status:", error.message)
          );
      }
    },
    updateEmailNotificationStatus(checked) {
      let emailNotificationsOff = !!this.emailNotificationsOff;
      if (checked === emailNotificationsOff) {
        var userRef = this.$fireDb.ref(`users/${this.user.id}`);
        userRef
          .update({ emailNotificationsOff: !checked })
          .then(() => {
            console.log("Successfully updated email notifications status");
            this.updateUserDetailsInStore();
            this.emailNotificationsOff = !checked;
          })
          .catch(error =>
            console.log(
              "Error updating email notification status:",
              error.message
            )
          );
      }
    },
    updateUserDetailsInStore() {
      let userObj = {
        id: this.user.id,
        photoURL: this.photoURL,
        displayName: this.username,
        email: this.email,
        biography: this.biography,
        emailNotificationsOff: this.emailNotificationsOff
      };
      this.$store.dispatch("SET_USER", userObj);
    },
    compressImage(file) {
      this.isLoading = true;
      let componentThis = this;
      const imageCompressor = new Compressor(file, {
        checkOrientation: true,
        maxWidth: 300,
        maxHeight: 300,
        quality: 0.6,
        // Convert ALL PNG images to JPEG
        convertSize: 0,
        success(result) {
          componentThis.updateProfileImg(result);
        },
        error(error) {
          console.log("Error compressing image:", error.message);
        }
      });
    },
    async updateProfileImg(upload) {
      this.removeProfileImg();
      let componentThis = this;
      var imageName = uuid.v1();
      try {
        //save image
        let file = upload;
        var metadata = {
          contentType: "image/png"
        };
        var storageRef = this.$fireStorage.ref();
        var imageRef = storageRef.child(
          `images/users/${this.user.id}/profileImg/${imageName}.png`
        );
        await imageRef.put(file, metadata);
        this.photoURL = await imageRef.getDownloadURL();

        this.$fireDb
          .ref("/users/" + this.user.id)
          .update({
            photoURL: componentThis.photoURL
          })
          .then(() => {
            this.updateProfileImgSystemMessage = "";
            componentThis.updateUserDetailsInStore();
          })
          .then(() => {
            componentThis.isLoading = false;
          })
          .catch(error => {
            this.removeProfileImgSystemMessage = error.message;
            console.log(error.message);
          });
      } catch (error) {
        console.log("Error updating profile image:", error.message);
        this.updateProfileImgSystemMessage = error.message;
      }
    },
    removeProfileImg() {
      let componentThis = this;
      let userID = this.user.id;
      let fileName = this.photoURL;

      var storageRef = this.$fireStorage.ref();
      if (userID) {
        var profileImgRef = storageRef.child(
          `images/users/${userID}/profileImg`
        );

        profileImgRef
          .listAll()
          .then(function(res) {
            res.items.forEach(function(itemRef) {
              itemRef.delete();
            });
          })
          .then(() => {
            componentThis.removeProfileImageFromDb();
          })
          .catch(function(error) {
            console.log("Error deleting files:", error.message);
            componentThis.removeProfileImgSystemMessage =
              "We're having trouble deleting your profile image. Please try again later or contact us.";
          });
      }
    },
    removeProfileImageFromDb() {
      let componentThis = this;

      this.$fireDb
        .ref("/users/" + this.user.id)
        .update({
          photoURL: ""
        })
        .then(() => {
          componentThis.removeProfileImgSystemMessage = "";
          componentThis.photoURL = "";
          componentThis.updateUserDetailsInStore();
          console.log("Successfully deleted profile img");
        })
        .catch(error => {
          console.log(error.message);
        });
    },
    updateUsername(value) {
      let componentThis = this;
      if (!value) value = "User";

      this.$fireDb
        .ref("/users/" + this.user.id)
        .update({
          displayName: value
        })
        .then(() => {
          componentThis.username = value;
          componentThis.updateUserDetailsInStore();
          this.usernameSystemMessage = "";
        })
        .catch(e => {
          this.usernameSystemMessage = e.message;
          console.log(e);
        });
    },
    updateEmail(value) {
      //Fix this with firebase
      let componentThis = this;
      /* this.$fireDb
        .ref("/users/" + this.user.id)
        .update({
          email: value
        })
        .then(() => {
          componentThis.email = value;
          componentThis.updateUserDetailsInStore();
          this.emailSystemMessage = "";
        })
        .catch(e => {
          this.emailSystemMessage = e.message;
          console.log(e);
        }); */
    },

    updateBiography(value) {
      let componentThis = this;
      this.$fireDb
        .ref("/users/" + this.user.id)
        .update({
          biography: value
        })
        .then(() => {
          componentThis.biography = value;
          componentThis.updateUserDetailsInStore();
          this.biographySystemMessage = "";
        })
        .catch(e => {
          this.biographySystemMessage = e.message;
          console.log(e);
        });
    },
    deleteAccount() {
      let user = this.$fireAuth.currentUser;
      const componentThis = this;

      let recipesRef = this.$fireDb.ref("recipes").orderByChild("ownerID");

      //Remove user's recipes
      recipesRef
        .once("value", recipes => {
          recipes.forEach(recipe => {
            if (recipe.val().ownerID === user.uid) {
              this.$fireDb
                .ref("recipes/" + recipe.key)
                .remove()
                .then(() => {
                  console.log("Success: Deleted recipe:", recipe.key);
                })
                .catch(error => {
                  console.log("Error: Recipe removal failed:", error.message);
                });
            }
          });
        })
        .then(() => {
          this.$fireDb
            .ref("users/" + user.uid)
            .remove()
            .then(function() {
              console.log("Success: User was removed from database");
            })
            .catch(function(error) {
              console.log("Error: User remove failed:", error.message);
              componentThis.systemMessage = error.message;
            });
        })
        .then(() => {
          user
            .delete()
            .then(() => {
              componentThis.systemMessage =
                "Your account was deleted successfully.";
              componentThis.$store.dispatch("REMOVE_USER");
              componentThis.$router.push("/goodbye/");
            })
            .catch(function(error) {
              componentThis.systemMessage = error.message;
              console.log("Error: User delete failed:", error.message);
            });
        })
        .catch(function(error) {
          componentThis.systemMessage = error.message;
          console.log("Error: Recipes reference failed:", error.message);
        });
    }
  },
  created() {
    this.username = this.user.displayName;
    this.email = this.user.email;
    this.biography = this.user.biography;
    this.photoURL = this.user.photoURL;
    this.emailNotificationsOff = this.user.emailNotificationsOff;
    this.hiddenProfile = this.user.hiddenProfile;
  }
};
</script>
