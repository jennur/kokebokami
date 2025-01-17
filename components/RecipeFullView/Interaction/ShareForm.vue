<template>
  <ModalBox :dark-bg="false" :open="open" @close="$emit('close-modal')">
    <h3>{{ $t("share") }} '{{ recipeTitle }}'</h3>

    <form v-if="user && user.id" class="share-form margin-v-lg" @submit.prevent>
      <div class="flex-row flex-row--align-center flex-row--nowrap">
        <h4 class="margin-bottom-sm">
          {{ $t("recipes.share.shareWithFollower") }}
        </h4>
      </div>

      <fieldset class="flex-row margin-bottom-md">
        <label class="share-form_followers">
          <SelectComponent
            class="share-form_select margin-top-md margin-right-md"
            :options="followerNames"
            defaultValue="Select a user"
            @select="(option) => (selected = option)"
          />
        </label>
      </fieldset>

      <div class="flex-row flex-row--align-center">
        <button
          @click="shareRecipe"
          class="button button-xs margin-left-xs margin-right-md"
        >
          {{ $t("share") }}
        </button>
        <span v-if="!useEmail" class="link small-text" @click="useEmail = true">
          {{ $t("recipes.share.iWantToEnterEmail") }}
        </span>
      </div>
    </form>

    <!--  Share by email  -->
    <ExpandTransition :show="useEmail || !this.user.id">
      <form class="share-form margin-v-lg" @submit.prevent>
        <div v-if="sharedByEmail === false" class="flex-center-container">
          <span class="simple-loading-spinner"></span>
        </div>

        <fieldset v-if="sharedByEmail === null">
          <h4 class="margin-bottom-sm">
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
              class="button button-xs margin-left-xs margin-top-md"
            >
              {{ $t("share") }}
            </button>
          </label>
        </fieldset>
      </form>
    </ExpandTransition>

    <div class="system-message margin-top-lg">{{ systemMessage }}</div>
  </ModalBox>
</template>

<script setup>
import { getDatabase, ref } from "firebase/database";

import axios from "axios";

import {
  anonymousTemplate,
  kokebokamiUsersTemplate,
} from "~/helpers/email-templates";

import { useConnectedUsers } from "~/composables";
import ExpandTransition from "~/components/Transitions/Expand.vue";
import SelectComponent from "~/components/Input/SelectComponent.vue";
import ModalBox from "~/components/ModalBox";
import { useAuthStore } from "~/store";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();
const { getConnectedUsers } = useConnectedUsers();
const connectedUsers = await getConnectedUsers();

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  recipeKey: {
    type: String,
    default: null,
  },
  recipeOwnerID: {
    type: String,
    default: null,
  },
  recipeTitle: {
    type: String,
    default: "",
  },
  recipeDescription: {
    type: String,
    default: "",
  },
});

const selected = ref("");
const sharedByEmail = ref(nul);
const systemMessage = ref("");
const useEmail = ref(fals);
const followers = ref(connectedUsers.followers);

const followerNames = computed(() => {
  return followers.value.map((follower) => {
    return follower.displayName;
  });
});

function validateEmail(email) {
  const emailRegex = /^\S+@\S+\.\S+$/;
  let validated = 1;

  if (!email.match(emailRegex)) {
    validated = validated * 0;
    systemMessage.value = t("enterValidEmailAddress");
    return false;
  } else {
    systemMessage.value = "";
    return true;
  }
}

function shareRecipeByEmail() {
  const email = document.getElementById("shareEmail").value;
  const path = router.route.fullPath;

  if (validateEmail(email)) {
    sharedByEmail.value = false;
    let message = anonymousTemplate(path, props.recipeTitle);
    axios
      .post("/api/send-email", {
        email,
        subject: `Someone just shared a recipe with you 📝`,
        message,
      })
      .then(() => {
        sharedByEmail.value = true;
        systemMessage.value = "E-mail was sent";
      })
      .catch((error) => {
        console.error("[shareRecipeByEmail]", error.message);
        sharedByEmail.value = null;
        systemMessage.value = `Something went wrong while attempting to send e-mail.
                              Please try again later, or contact us if the issue continues`;
      });
  }
}

function shareRecipe() {
  const selectedDisplayName = selected.value;

  const db = getDatabase();
  const sharesRef = ref(db, `recipes/${props.recipeKey}/sharedWith`);
;
  const selectedFollower = followers.value.filter((follower) => {
    return follower.displayName === selectedDisplayName;
  })[0];

  if (!selectedFollower) {
    systemMessage.value = "This user does not exist in the database";
    return;
  }

  const username = selectedFollower.displayName;
  const dontSend =
    selectedFollower.notificationsOff &&
    selectedFollower.notificationsOff.recipe;

  sharesRef.once("value", (snapshot) => {
    if (snapshot.exists()) {
      let shares = Object.values(snapshot.val());
      if (shares.indexOf(selectedFollower.id) > -1) {
        systemMessage.value = `This recipe is already shared with ${username}`;
        return;
      }
    }
    sharesRef
      .push(selectedFollower.id)
      .then(() => {
        if (!dontSend) {
          sendNotificationEmail({
            displayName: username,
            id: selectedFollower.id,
          });
        }
      })
      .catch((error) =>
        console.error("[shareRecipe]", error.message)
      );
    systemMessage.value = `Successfully shared with ${username}`;
  });
}

function sendNotificationEmail(receiver) {
  const sender = authStore.user.displayName;
  const path = router.route.fullPath;
  const message = kokebokamiUsersTemplate(
    receiver.displayName,
    sender,
    path,
    props.recipeTitle
  );
  axios
    .post("/api/send-email", {
      receiverID: receiver.id,
      subject: `${sender} just shared a recipe with you 📝`,
      message,
    })
    .catch((error) => console.error("[sendNotificationEmail]", error.message));
}
</script>
