<template>
  <section class="shopping-list margin-bottom--large">
    <!-- Delete / Cancel action -->

    <div class="shopping-list__cancel-action">
      <settings-dropdown v-if="list.key" :right="true">
        <span class="system-message" @click="toggleAlert"
          ><delete-icon tabindex="0" class="icon margin-right--medium" />Delete
          collection</span
        >
      </settings-dropdown>
      <button
        v-if="!list.key"
        class="button button--dynamic button--cancel"
        @click="$emit('cancel')"
      >
        ✕
      </button>
    </div>
    <Alert
      :alertMessage="
        `Are you sure you want to delete this shopping list: '${list.title}'?`
      "
      :showAlert="showAlert"
      @confirmed="deleteShoppingList"
      @cancel="toggleAlert"
    />
    <div class="flex-row flex-row--align-center margin-bottom--large">
      <!-- Share action -->
      <div v-if="list && list.key">
        <div v-if="!sharing">
          <share-icon class="icon icon--blue" @click="toggleShareBox" />
        </div>
        <button
          v-else
          class="button button--small button--transparent button--transparent-red"
          @click="toggleShareBox"
        >
          ✕ Close
        </button>
        <shareBox
          :open="sharing"
          @share="follower => shareShoppingList(follower)"
          class="margin-top--medium"
        />
        <div v-if="systemMessage" class="system-message margin-top--large">
          {{ systemMessage }}
        </div>
      </div>
    </div>
    <!-- Shopping list title -->
    <div class="shopping-list__title margin-bottom--large margin-top--xxlarge">
      <div
        v-if="list.title && !editTitle"
        class="flex-row flex-row--align-center margin-top--large"
      >
        <h2
          class="margin-bottom--small margin-right--large"
          @click="event => toggleEditTitle(event)"
        >
          {{ list.title }}
        </h2>
        <span v-if="shared" class="shopping-list__shared">
          Shared from:
          <nuxt-link :to="`/cooks/${list.createdBy.id}/`">{{
            list.createdBy.displayName
          }}</nuxt-link>
        </span>
        <span v-if="sharedWith" class="shopping-list__shared">
          Shared with:
          <nuxt-link
            v-for="(user, index) in sharedWith"
            :key="user.id"
            :to="`/cooks/${user.id}/`"
            >{{ user.displayName }}
            {{ index !== sharedWith.length - 1 ? ", " : "" }}</nuxt-link
          >
        </span>
      </div>

      <!-- Edit mode for title -->
      <div v-if="editTitle" class="flex-row flex-row--align-center">
        <input
          type="text"
          v-model="updatedTitle"
          class="margin-right--large"
          v-click-outside="saveTitle"
          @keydown="
            event => {
              event.keyCode === 13 && saveTitle();
            }
          "
        />
        <div
          class="flex-row flex-row--align-center flex-row--nowrap margin-top--medium"
        ></div>
      </div>
    </div>
    <!-- Sublists -->
    <div class="flex-row">
      <sub-list
        v-for="(subList, index) in subLists"
        :key="`shopping-list-${index}`"
        :subList="subList[1]"
        :subListKey="subList[0]"
        :mainListTitle="list.title"
        :mainListKey="list.key"
        @update="updateSubLists"
      />
      <sub-list
        v-if="addingNewSubList"
        :subList="{ title: '', listItems: [] }"
        :subListKey="''"
        :mainListTitle="list.title"
        :mainListKey="list.key"
        @update="updateSubLists"
      />
    </div>
    <div
      class="flex-row flex-row--align-center flex-row--space-between full-width"
    >
      <increment-button
        class="margin-vertical--large margin-right--xxlarge"
        @increment="addNewSubList"
        >New sublist</increment-button
      >
    </div>
  </section>
</template>

<script>
import axios from "axios";
import ClickOutside from "vue-click-outside";
import shareIcon from "~/assets/graphics/icons/shareicon.svg";

import user from "~/mixins/user.js";

import SettingsDropdown from "~/components/SettingsDropdown.vue";
import Alert from "~/components/Alert.vue";
import ShareBox from "./ShareBox.vue";
import IncrementButton from "~/components/Input/IncrementButton.vue";
import DecrementButton from "~/components/Input/DecrementButton.vue";
import SubList from "./SubList.vue";

export default {
  name: "shopping-list",
  components: {
    shareIcon,
    SettingsDropdown,
    Alert,
    ShareBox,
    IncrementButton,
    DecrementButton,
    SubList
  },
  props: {
    list: {
      type: Object,
      default: () => {}
    }
  },
  mixins: [user],
  data() {
    return {
      updatedTitle: this.list && this.list.title,
      editTitle: false,
      addingNewSubList: false,
      sharing: false,
      systemMessage: "",
      showAlert: false
    };
  },
  computed: {
    shared() {
      let createdByID = this.list.createdBy && this.list.createdBy.id;
      return createdByID && createdByID !== this.user.id;
    },
    sharedWith() {
      let createdByID = this.list.createdBy && this.list.createdBy.id;
      let sharedWith = [];
      if (createdByID === this.user.id) {
        sharedWith = Object.values(this.list.owners).filter(
          user => user.id !== this.user.id
        );
      }
      return sharedWith.length && sharedWith;
    },
    subLists() {
      let subLists = this.list.subLists;
      return (subLists && Object.entries(subLists)) || [];
    }
  },
  methods: {
    toggleAlert() {
      this.showAlert = !this.showAlert;
    },
    toggleShareBox() {
      this.sharing = !this.sharing;
      this.systemMessage = "";
    },
    toggleEditTitle(event) {
      this.editTitle = !this.editTitle;
      event && event.stopPropagation();
    },
    saveTitle() {
      this.addingNewSubList = false;
      let componentThis = this;
      let mainListKey = this.list.key;
      let currentUserID = this.user.id;
      let username = this.user.displayName;

      if (this.list.title !== this.updatedTitle) {
        let title = this.updatedTitle;

        if (mainListKey) {
          let thisListRef = this.$fireDb.ref(`shoppingLists/${mainListKey}`);
          thisListRef
            .update({ title })
            .then(() => {
              console.log("Title updated");
              componentThis.toggleEditTitle();
              componentThis.$emit("update");
            })
            .catch(error => {
              console.log("Title update failed:", error.message);
            });
        } else {
          let shoppingListRef = this.$fireDb.ref(`shoppingLists`);
          shoppingListRef.once("value", snapshot => {
            shoppingListRef
              .push({
                title,
                createdBy: { id: currentUserID, displayName: username },
                owners: [{ id: currentUserID, displayName: username }]
              })
              .then(mainListObject => {
                console.log("New main list added");
                componentThis.toggleEditTitle();
                componentThis.$emit("update");
              })
              .catch(error => {
                console.log("Title update failed:", error.message);
              });
          });
        }
      } else {
        this.toggleEditTitle();
      }
    },
    addNewSubList() {
      this.addingNewSubList = true;
    },
    updateSubLists() {
      this.addingNewSubList = false;
      this.$emit("update");
    },
    shareShoppingList(follower) {
      if (follower.length && follower[0] !== "") {
        let componentThis = this;
        let currentUserID = this.user.id;
        let username = this.user.displayName;
        let mainListKey = this.list.key;
        let followerUsername = follower[1].displayName;
        let followerID = follower[0];

        let ownersRef = this.$fireDb.ref(`shoppingLists/${mainListKey}/owners`);

        try {
          ownersRef.once("value", snapshot => {
            if (snapshot.exists()) {
              let owners = Object.values(snapshot.val());
              let shared = false;
              owners.forEach(user => {
                if (user.id === followerID) {
                  componentThis.systemMessage = `This shopping list is already shared with ${followerUsername} `;
                  shared = true;
                }
              });

              if (!shared) {
                ownersRef
                  .push({
                    id: followerID,
                    displayName: followerUsername,
                    sharedFrom: { id: currentUserID, displayName: username }
                  })
                  .then(() => {
                    componentThis.systemMessage = `Successfully shared with ${followerUsername}`;
                    componentThis.$emit("update");
                    if (!follower.emailNotificationsOff) {
                      this.sendEmail(follower);
                    }
                  });
              }
            }
          });
        } catch (error) {
          console.log("Error while sharing:", error.message);
          this.systemMessage = "An error occured while sharing";
        }
      } else {
        this.systemMessage = "We were unable to find this user in the database";
      }
    },
    sendEmail(receiver) {
      let message = `<p>Hi ${receiver[1].displayName},
          <br>
          <br>You just received a shopping list from ${this.user.displayName}.
          <br>'${this.list.title}' is now available among your shopping list.
          <br>
          <br>Login to <a href="https://kokebokami.com">Kokebokami</a> to check it out!
          <br>
          <br>Best wishes,
          <br>Your Kokebokami team 👩‍🍳</p>`;
      let receiverRef = this.$fireDb.ref(`users/${receiver[0]}`);
      receiverRef
        .once("value", receiver => {
          if (receiver.exists()) {
            receiver = receiver.val();
            axios
              .post("/api/send-email", {
                email: receiver.email,
                subject: `${this.user.displayName} just shared a shopping list with you 📝`,
                message
              })
              .catch(error => console.log("Error:", error));
          }
        })
        .catch(error => console.log("Error getting user", error));
    },
    deleteShoppingList() {
      let componentThis = this;
      let currentUserID = this.user.id;
      let mainListRef = this.$fireDb.ref(`shoppingLists/${this.list.key}`);
      let ownersRef = this.$fireDb.ref(`shoppingLists/${this.list.key}/owners`);

      let owners = this.list.owners && Object.values(this.list.owners);

      if (owners.length <= 1) {
        // Remove completely from database
        mainListRef
          .remove()
          .then(() => {
            console.log("Successfully deleted shopping list");
            componentThis.toggleAlert();
            componentThis.$emit("update");
          })
          .catch(error =>
            console.log("Error deleting shopping list:", error.message)
          );
      } else {
        //Delete only for current user
        ownersRef.once("value", snapshot => {
          if (snapshot.exists()) {
            let owners = Object.entries(snapshot.val());
            owners = owners.filter(user => {
              return user[1].id !== currentUserID;
            });

            owners = Object.fromEntries(owners);
            mainListRef.update({ owners }).then(() => {
              componentThis.toggleAlert();
              componentThis.$emit("update");
            });
          }
        });
      }
    }
  },
  directives: {
    ClickOutside
  }
};
</script>
