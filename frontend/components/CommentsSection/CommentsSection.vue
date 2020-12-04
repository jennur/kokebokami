<template>
  <div class="comments-section margin-bottom--xxlarge">
    <div class="comments-section__headline">
      <h3 class="margin-top--xxlarge margin-bottom--medium">
        {{ $t("comments.headline") }}
      </h3>
    </div>
    <comment-form
      class="margin-bottom--xlarge"
      @addComment="commentObj => submitComment(commentObj)"
      :isRecipeOwner="user && user.id === recipeOwnerID"
      :submitted="submitted"
      :error="error"
    />
    <comments
      :recipeKey="recipeKey"
      :isRecipeOwner="user && user.id === recipeOwnerID"
      :update="updateComments"
      @send-email="commentObj => sendEmail(commentObj)"
    />
  </div>
</template>

<script>
import axios from "axios";
import user from "~/mixins/user.js";

import CommentForm from "./CommentForm.vue";
import Comments from "./Comments.vue";

export default {
  name: "comments-section",
  components: {
    CommentForm,
    Comments
  },
  props: {
    recipeKey: {
      type: String,
      default: ""
    },
    recipeOwnerID: {
      type: String,
      default: ""
    },
    recipeTitle: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      submitted: false,
      error: false,
      updateComments: 0
    };
  },
  mixins: [user],
  methods: {
    async sendEmail(commentObj) {
      let username = commentObj.isAnonymous
        ? `${this.$t("anonymous")}`
        : commentObj.username;

      let message = `<div style="display:block;width:100%;height:100%;padding-bottom:20px;padding-left:50px;padding-right:50px;background-color:#fffdf8;color:#063c60;">
                      <p style="color:#063c60;">
                        <br>
                            <span style="color:#063c60;">
                              ${username} just commented on your recipe '${this.recipeTitle}':
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
      this.$fire.database
        .ref(`users/${this.recipeOwnerID}/notificationsOff/comments`)
        .once("value", snapshot => {
          let commentNotificationsOff = snapshot.exists() && snapshot.val();
          if (!commentNotificationsOff) {
            axios
              .post("/api/send-email", {
                receiverID: this.recipeOwnerID,
                subject: `${username} just commented on your recipe 🧑‍💻`,
                message
              })
              .catch(error =>
                console.log("Error sending notification email:", error)
              );
          }
        });
    },
    submitComment(commentObj) {
      let recipeKey = this.recipeKey;
      let commentsRef = this.$fire.database.ref(`recipes/${recipeKey}/comments`);
      commentsRef
        .push(commentObj)
        .then(() => {
          this.submitted = true;
          this.error = false;
          this.updateComments++;
          if (this.user && this.user.id !== this.recipeOwnerID) {
            this.sendEmail(commentObj);
          }
        })
        .catch(error => {
          this.error = true;
          console.log("Error submitting comment:", error.message);
        });
    }
  }
};
</script>
