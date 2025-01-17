<template>
  <div class="comments-section margin-bottom-2xl">
    <div class="comments-section_headline">
      <h3 class="margin-top-2xl margin-bottom-md">
        {{ $t("comments.headline") }}
      </h3>
    </div>
    <comment-form
      class="margin-bottom-xl"
      @addComment="(commentObj) => submitComment(commentObj)"
      :isRecipeOwner="user && user.id === recipeOwnerID"
      :submitted="submitted"
      :error="hasError"
    />
    <comments
      :recipeKey="recipeKey"
      :isRecipeOwner="user && user.id === recipeOwnerID"
      :update="updateComments"
      @send-email="(commentObj) => sendEmail(commentObj)"
    />
  </div>
</template>

<script setup>
import axios from "axios";
import { getDatabase, ref, get } from "firebase/database";
import CommentForm from "./CommentForm.vue";
import Comments from "./Comments.vue";
import { useAuthStore } from "~/store";

const authStore = useAuthStore();
const { t } = useI18n();

const props = defineProps({
  recipeKey: {
    type: String,
    default: "",
  },
  recipeOwnerID: {
    type: String,
    default: "",
  },
  recipeTitle: {
    type: String,
    default: "",
  },
});

const submitted = ref(false);
const hasError = ref(false);
const updateComments = ref(0);

async function sendEmail(commentObj) {
  const username = commentObj.isAnonymous
    ? `${t("anonymous")}`
    : commentObj.username;

  const message = `<div style="display:block;width:100%;height:100%;padding-bottom:20px;padding-left:50px;padding-right:50px;background-color:#fffdf8;color:#063c60;">
                      <p style="color:#063c60;">
                        <br>
                            <span style="color:#063c60;">
                              ${username} just commented on your recipe '${props.recipeTitle}':
                            </span>
                        <br>
                            <blockquote style="color:#063c60;font-size:18px;width:100%;max-width:500px;">«${commentObj.comment}»</blockquote>
                            <span style="color:#063c60;">
                              Login to <a style="color:#ff7300;" href="https://kokebokami.com">Kokebokami</a> to approve the comment.
                            </span>
                        <br>
                        <br>
                        <br>
                            <span style="color:#063c60;">
                              Best wishes,
                              <br>Your Kokebokami team 👩‍🍳
                            </span>
                        <br>
                        <br>
                        <br>
                        <span style="font-size: 12px;color:#063c60;">
                          To stop receiving these emails, turn off email notifications in your account settings at
                          <a style="color:#ff7300;" href="https://kokebokami.com">kokebokami.com</a>
                        </span>
                      </p>
                    </div>`;

  try {
    const db = getDatabase();
    const snapshot = await get(
      ref(db, `users/${props.recipeOwnerID}/notificationsOff/comments`)
    );
    const commentNotificationsOff = snapshot.exists() && snapshot.val();
    if (!commentNotificationsOff) {
      axios
        .post("/api/send-email", {
          receiverID: props.recipeOwnerID,
          subject: `${username} just commented on your recipe 🧑‍💻`,
          message,
        })
        .catch((hasE) =>
          console.log("Error sending notification email:", hasE)
        );
    }
  } catch (hasE) {
    console.hasE("[sendEmail]", hasE.message);
  }
}

function submitComment(commentObj) {
  if (props.recipeKey) {
    const db = getDatabase();
    push(ref(db, `recipes/${props.recipeKey}/comments`), commentObj)
      .then(() => {
        submitted.value = true;
        hasError.value = false;
        updateComments.value++;
        if (authStore.user?.id !== props.recipeOwnerID) {
          sendEmail(commentObj);
        }
      })
      .catch((hasE) => {
        hasError.value = true;
        console.log("Error submitting comment:", hasE.message);
      });
  }
}
</script>
