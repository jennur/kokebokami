<template>
  <form class="sign-up-form margin--auto" v-on:submit.prevent>
    <label class="flex-column margin-bottom--medium">
      Name
      <input class="margin-top--small" id="name" type="text" v-model="name" />
      <span class="system-message">{{nameError}}</span>
    </label>
    <label class="flex-column margin-bottom--medium">
      E-mail address
      <input class="margin-top--small" id="email" type="email" v-model="email" />
      <span class="system-message">{{emailError}}</span>
    </label>
    <label class="flex-column margin-bottom--medium">
      Password
      <input class="margin-top--small" id="password" type="password" v-model="password" />
      <span class="system-message">{{passwordError}}</span>
    </label>
    <label class="flex-column margin-bottom--medium">
      Repeat password
      <input
        class="margin-top--small"
        id="password-repeated"
        type="password"
        v-model="passwordRepeat"
      />
      <span class="system-message">{{passwordRepeatError}}</span>
    </label>

    <div class="flex-column margin-bottom--medium">
      <button @click="validateForm" class="button button--small button--green">Sign up</button>
      <span class="system-message">{{systemMessage}}</span>
    </div>
  </form>
</template>
<script>
import { auth, db } from "~/plugins/firebase.js";
export default {
  name: "sign-up-form",
  data() {
    return {
      name: "",
      nameError: "",
      email: "",
      emailError: "",
      password: "",
      passwordError: "",
      passwordRepeat: "",
      passwordRepeatError: "",
      systemMessage: ""
    };
  },
  methods: {
    signUp() {
      const realThis = this;
      auth
        .createUserWithEmailAndPassword(realThis.email, realThis.password)
        .then(response => {
          let user = {
            id: response.user.uid,
            name: realThis.name
          };
          db.ref("users/" + response.user.uid)
            .child("displayName")
            .set(realThis.name);
          realThis.$store.dispatch("SET_USER", user);
          if (response.user.uid !== undefined) {
            realThis.$router.push("/account");
          }
        })
        .catch(function(error) {
          realThis.systemMessage = error.message;
          console.log(
            "Failed with error code: " + error.code + " " + error.message
          );
        });
    },
    validateForm() {
      const emailRegex = /.{1,}@[^.]{1,}/;
      let validated = 1;

      if (this.name === "") {
        validated = validated * 0;
        this.nameError = "This field cannot be empty";
      } else this.nameError = "";

      if (!this.email.match(emailRegex)) {
        validated = validated * 0;
        this.emailError = "Please enter a valid email address";
      } else this.emailError = "";

      if (this.password.length < 6) {
        validated = validated * 0;
        this.passwordError = "Password needs to be at least 6 characters";
      } else this.passwordError = "";

      if (this.password !== this.passwordRepeat) {
        validated = validated * 0;
        this.passwordRepeatError = "Passwords does not match";
      } else this.passwordRepeatError = "";

      if (validated === 1) {
        this.signUp();
      }
    }
  }
};
</script>
