<template>
  <div>
    <BreadCrumbs :routes="breadcrumbs" />
    <div class="account container tablet-width padding-h-lg">
      <h1 class="margin-top-2xl margin-bottom-lg">
        {{ $t("accountDetails.headline") }}
      </h1>
      <NuxtLink :to="$localePath('/account/public-profile-view/')">
        {{ $t("accountDetails.seeYourPublicProfile") }}
        <right-arrow class="icon icon--blue" />
      </NuxtLink>
      <div>
        <h3 class="margin-top-2xl">
          {{ $t("accountDetails.personalData") }}
        </h3>
        <dl class="flex-row">
          <AccountDetail
            :title="$t('accountDetails.profileImage')"
            :systemMessage="
              removeProfileImgSystemMessage || updateProfileImgSystemMessage
            "
            :visibleToPublic="true"
            :editOption="true"
            :removeOption="true"
            @update="(value) => compressImage(value)"
            @remove="removeProfileImg"
            :currentValue="photoURL"
            :isImage="true"
            :isLoading="isLoading"
          />
          <AccountDetail
            :title="$t('accountDetails.biography')"
            :systemMessage="biographySystemMessage"
            :visibleToPublic="true"
            :editOption="true"
            inputType="textarea"
            @update="(value) => updateBiography(value)"
            :currentValue="biography"
          />
          <AccountDetail
            :title="$t('accountDetails.username')"
            :systemMessage="usernameSystemMessage"
            :visibleToPublic="true"
            :editOption="true"
            autocompleteType="username"
            @update="(value) => updateUsername(value)"
            :validate="validateUsername"
            :currentValue="username && username.length ? username : 'User'"
          />

          <AccountDetail
            :systemMessage="emailSystemMessage"
            :visibleToPublic="false"
            :editOption="false"
            :title="$t('accountDetails.email')"
            inputType="email"
            autocompleteType="email"
            @update="(value) => updateEmail(value)"
            :currentValue="email"
          />
        </dl>

        <h3>{{ $t("accountDetails.recipesConnectedToYourAccount") }}</h3>
        <dl class="flex-row">
          <AccountLinkList
            :title="`${$t('accountDetails.myRecipes')}:`"
            :links="recipeStore.userRecipes"
            basePath="/recipes/"
          />
          <AccountLinkList
            :title="`${$t('accountDetails.recipesSharedWithMe')}:`"
            :links="recipeStore.userSharedRecipes"
            basePath="/recipes/"
          />
          <AccountLinkList
            :title="`${$t('accountDetails.myRecipeLinks')}:`"
            :links="recipeLinks"
            :externalURL="true"
          />
        </dl>

        <h3>{{ $t("accountDetails.cooksConnectedToYourAccount") }}</h3>
        <dl class="flex-row">
          <AccountLinkList
            :title="`${$t('accountDetails.following')}:`"
            :links="followed"
            basePath="/cooks/"
          />
          <AccountLinkList
            :title="`${$t('accountDetails.followers')}:`"
            :links="followers"
            basePath="/cooks/"
          />
        </dl>
        <dl class="flex-row">
          <h3 class="full-width">
            {{ $t("accountDetails.emailNotifications.headline") }}
          </h3>
          <dt class="full-width account_detail account_detail--flex-column">
            <h4 class="account_detail-title">
              {{ $t("accountDetails.emailNotifications.infoNote") }}
            </h4>
            <p>{{ $t("accountDetails.notifyMe") }}...</p>
            <ToggleSetting
              :setting="{
                title: `${$t('accountDetails.recipeSharing')}`,
                status: !authStore.user?.notificationsOff?.recipes,
              }"
              @update-notification-status="
                (status) => updateNotificationStatus('recipes', status)
              "
            />
            <ToggleSetting
              :setting="{
                title: `${$t('accountDetails.shoppingListSharing')}`,
                status: !authStore.user?.notificationsOff?.shoppingLists,
              }"
              @update-notification-status="
                (status) => updateNotificationStatus('shoppingLists', status)
              "
            />
            <ToggleSetting
              :setting="{
                title: `${$t('accountDetails.comments')}`,
                status: !authStore.user?.notificationsOff?.comments,
              }"
              @update-notification-status="
                (status) => updateNotificationStatus('comments', status)
              "
            />
          </dt>
        </dl>
        <dl class="flex-row">
          <h3 class="full-width">
            {{ $t("accountDetails.profileVisibility.headline") }}
          </h3>
          <dt class="full-width account_detail account_detail--flex-column">
            <h4 class="account_detail-title">
              <p>
                {{ $t("accountDetails.profileVisibility.infoNote") }}
              </p>
            </h4>
            <div class="flex-row flex-row--align-center">
              <p class="email-notifications margin-right-sm">
                {{ $t("accountDetails.profileVisibility.yourProfileIs") }}
                <strong
                  class="email-notifications_status"
                  :class="{
                    'color--pink': authStore.user.hiddenProfile,
                    'color--blue': !authStore.user.hiddenProfile,
                  }"
                  >{{ authStore.user.hiddenProfile ? $t("closed") : $t("open") }}</strong
                >
                <ToggleSwitch
                  :checked="!authStore.user.hiddenProfile"
                  @toggle="updateHiddenProfileStatus"
                />
              </p>
            </div>
          </dt>
        </dl>
        <button
          class="button button-sm button--trans button--trans-red margin-top-lg"
          @click="toggleAlert"
        >
          <delete-icon class="icon margin-right-sm" />{{
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

<script setup>
import { getDatabase, ref, get } from "firebase/database";

const uuid = require("uuid");
import Compressor from "compressorjs";
import { useConnectedUsers } from "~/composables";
import userRecipes from "~/mixins/user-recipes.js";
import recipeLinks from "~/mixins/user-recipe-links.js";
// import validateUsername from "~/helpers/validate-username.js";

import AccountDetail from "~/components/Account/Displays/AccountDetail.vue";
import AccountLinkList from "~/components/Account/Displays/AccountLinkList.vue";
import Alert from "~/components/Alert.vue";
import ToggleSetting from "~/components/Account/Displays/ToggleSetting.vue";
import ToggleSwitch from "~/components/Input/ToggleSwitch.vue";
import {
  getStorage,
  getDownloadURL,
  uploadBytes,
  ref as storageRef,
  listAll,
  deleteObject,
} from "firebase/storage";
import { useAuthStore, useRecipeStore } from "~/store";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { getAuth } from "firebase/auth";

const router = useRouter();
const db = getDatabase();
const { t } = useI18n();

const authStore = useAuthStore();
const recipeStore = useRecipeStore();
const connectedUsers = useConnectedUsers();

useHead(() => {
  return {
    title: `Account details | Kokebokami`,
    meta: [
      {
        name: "robots",
        content: "noindex",
      },
    ],
    link: [
      {
        rel: "canonical",
        href: "https://kokebokami.com/account/account-details/",
      },
    ],
  };
});

const systemMessage = ref("");
const updateProfileImgSystemMessage = ref("");
const removeProfileImgSystemMessage = ref("");
const emailSystemMessage = ref("");
const usernameSystemMessage = ref("");
const biographySystemMessage = ref("");
const photoURL = ref("");
const username = ref("");
const email = ref("");
const biography = ref("");
const isLoading = ref(false);
const showAlert = ref(false);
const notificationsOff = ref({});
const hiddenProfile = ref(fals);
const followers = ref(connectedUsers.followers);
const followed = ref(connectedUsers.followed);
// mixins: [
//   user,
//   connectedUsers,
//   userRecipes,
//   recipeLinks,
// ],

const breadcrumbs = computed(() => {
  return [
    { name: t("navigation.home"), link: "/" },
    { name: t("navigation.myAccount"), link: "/account/" },
    { name: t("navigation.accountDetails") },
  ];
});

function toggleAlert() {
  showAlert.value = !showAlert.value;
}

function updateHiddenProfileStatus(checked) {
  if (checked === hiddenProfile.value) {
    ref(db, `users/${authStore.user.id}`)
      .update({ hiddenProfile: !checked })
      .then(() => {
        console.ifo(
          "[updateHiddenProfileStatus] Successfully updated hidden profile status"
        );
        updateUserDetailsInStore();
        hiddenProfile.value = !checked;
      })
      .catch((error) =>
        console.error("[updateHiddenProfileStatus]", error.message)
      );
  }
}

function updateNotificationStatus(type, status) {
  if (status !== notificationsOff?.value[type]) {
    notificationsOff.value[type] = status;
    set(
      ref(db, `users/${authStore.user.id}/notificationsOff`),
      notificationsOff.value
    )
      .then(() => {
        console.info(
          `[updateNotificationStatus] Successfully updated ${type} notifications status`
        );
        notificationsOff.value[type] = status;
        updateUserDetailsInStore();
      })
      .catch((error) =>
        console.error("[updateNotificationStatus]", error.message)
      );
  }
}
function updateUserDetailsInStore() {
  authStore.SET_USER();
}

function compressImage(file) {
  isLoading.value = true;
  const imageCompressor = new Compressor(file, {
    checkOrientation: true,
    maxWidth: 300,
    maxHeight: 300,
    quality: 0.6,
    // Convert ALL PNG images to JPEG
    convertSize: 0,
    success(result) {
      updateProfileImg(result);
    },
    error(error) {
      console.error("[compressImage]", error.message);
    },
  });
}

async function updateProfileImg(upload) {
  removeProfileImg();
  const imageName = uuid.v1();
  try {
    //save image
    const file = upload;

    const storage = getStorage();
    const imageRef = storageRef(
      storage,
      `images/users/${authStore.user.id}/profileImg/${imageName}.png`
    );

    await uploadBytes(imageRef, file, {
      contentType: "image/png",
    });

    const downloadURL = await getDownloadURL(imageRef);
    photoURL.value = downloadURL;

    update(ref(db, `/users/${authStore.user.id}`), { photoURL: downloadURL })
      .then(() => {
        updateProfileImgSystemMessage.value = "";
        updateUserDetailsInStore();
      })
      .then(() => {
        isLoading.value = false;
      })
      .catch((error) => {
        removeProfileImgSystemMessage.value = error.message;
        console.error("[updateProfileImg]", error.message);
      });
  } catch (error) {
    console.error("[updateProfileImg]", error.message);
    updateProfileImgSystemMessage.value = error.message;
  }
}

function removeProfileImg() {
  if (authStore.user.id) {
    listAll(storageRef(db, `images/users/${authStore.user.id}/profileImg`))
      .then((res) => {
        res.items.forEach((itemRef) => {
          deleteObject(itemRef);
        });
      })
      .then(() => {
        removeProfileImageFromDb();
      })
      .catch((error) => {
        console.error("[removeProfileImg]", error.message);
        removeProfileImgSystemMessage.value =
          "We're having trouble deleting your profile image. Please try again later or contact us.";
      });
  }
}

function removeProfileImageFromDb() {
  update(ref(db, `/users/${authStore.user.id}`), {
    photoURL: "",
  })
    .then(() => {
      removeProfileImgSystemMessage.value = "";
      photoURL.value = "";
      updateUserDetailsInStore();
      console.info(
        "[removeProfileImageFromDb] Successfully deleted profile img"
      );
    })
    .catch((error) => {
      console.error("[removeProfileImageFromDb]", error.message);
    });
}
function updateUsername(value) {
  update(ref(db, `/users/${authStore.user.id}`), {
    displayName: value,
  })
    .then(() => {
      username.value = value;
      usernameSystemMessage.value = "";
      updateUserDetailsInStore();
    })
    .catch((error) => {
      usernameSystemMessage.value =
        "Something went wrong while updating your username.";
      console.error("[updateUsername]", error.message);
    });
}
function updateBiography(value) {
  update(ref(db, `/users/${authStore.user.id}`), {
    biography: value,
  })
    .then(() => {
      biography.value = value;
      biographySystemMessage.value = "";
      updateUserDetailsInStore();
    })
    .catch((e) => {
      biographySystemMessage.value = e.message;
      console.log(e);
    });
}
function deleteAccount() {
  get(ref(db, "recipes"))
    .then((snapshot) => {
      //Remove user's recipes
      snapshot.forEach((recipe) => {
        const key = recipe.key;
        const content = recipe.val();

        if (content.ownerID === authStore.user.id) {
          remove(ref(db, "recipes/" + key))
            .then(() => {
              console.info("[deleteAccount] Successfully deleted recipe:", key);
            })
            .catch((error) => {
              console.error(
                "[deleteAccount] Error on recipe removal:",
                key,
                error.message
              );
            });
        }
      });
    })
    .then(() => {
      // Remove user from database
      if (authStore.user.id) {
        remove(ref(db, `users/${authStore.user.id}`))
          .then(() => {
            console.info(
              "[deleteAccount] Successfully removed user from database"
            );
          })
          .catch((error) => {
            console.error(
              "[deleteAccount] Failed to remove user from database:",
              error.message
            );
            systemMessage.value = error.message;
          });
      }
    })
    .then(() => {
      const auth = getAuth();
      const user = auth.currentUser();
      user &&
        deleteUser(user)
          .then(() => {
            systemMessage.value = "Your account was deleted successfully.";
            authStore.REMOVE_USER();
            router.push("/goodbye/");
          })
          .catch((error) => {
            systemMessage.value = error.message;
            console.error(
              "[deleteAccount] Failed to delete user",
              error.message
            );
          });
    })
    .catch((error) => {
      systemMessage.value = error.message;
      console.error("[deleteAccount]", error.message);
    });
}
onMounted(() => {
  username.value = authStore.user.displayName;
  email.value = authStore.user.email;
  biography.value = authStore.user.biography;
  photoURL.value = authStore.user.photoURL;
  hiddenProfile.value = authStore.user.hiddenProfile;
  notificationsOff.value = authStore.user.notificationsOff;
});
</script>
