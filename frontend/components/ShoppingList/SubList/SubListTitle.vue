<template>
  <div class="flex-row flex-row--align-center margin-bottom--xlarge">
    <div class="sub-list__title">
      <h3
        v-if="!editMode && title"
        class="heading--blue margin--none"
        @click="event => toggleEditMode(event)"
      >
        {{ updatedTitle }}
      </h3>
      <label v-if="editMode" class="flex-column">
        <input
          type="text"
          v-model="updatedTitle"
          placeholder="Sublist title"
          v-click-outside="saveTitle"
          @keydown="
            event => {
              event.keyCode === 13 && saveTitle();
            }
          "
        />
      </label>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
import user from "~/mixins/user.js";

export default {
  name: "sublist-title",
  props: {
    title: {
      type: String,
      default: ""
    },
    mainListKey: {
      type: String,
      default: ""
    },
    subListKey: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      editMode: false,
      updatedTitle: this.title,
      isNew: false
    };
  },
  mixins: [user],
  watch: {
    title: function(val) {
      this.updatedTitle = val;
    }
  },
  methods: {
    toggleEditMode(event) {
      event && event.stopPropagation();
      this.editMode = !this.editMode;
    },
    saveTitle() {
      if (this.isNew || this.title !== this.updatedTitle) {
        this.isNew = false;
        let componentThis = this;
        let userID = this.user.id;
        let username = this.user.displayName;

        let mainListKey = this.mainListKey;
        let mainListTitle = this.mainListTitle || "New shopping list";

        let title = this.updatedTitle;
        let subListKey = this.subListKey;

        let shoppingListsRef = this.$fireDb.ref(`shoppingLists`);
        let mainListRef = this.$fireDb.ref(`shoppingLists/${mainListKey}`);

        if (mainListKey && subListKey !== "") {
          mainListRef
            .child("subLists")
            .child(subListKey)
            .update({ title })
            .then(() => {
              console.log("Sublist successfully updated");
              componentThis.editMode = false;
              componentThis.$emit("update");
            })
            .catch(error =>
              console.log("Error updating subList:", error.message)
            );
        } else if (mainListKey && subListKey === "") {
          console.log("Adding new sublist");
          mainListRef
            .child("subLists")
            .push({ title })
            .then(result => {
              console.log("Successfully added new sublist");
              componentThis.editMode = false;
              componentThis.$emit("update");
            })
            .catch(error =>
              console.log("Error setting subList:", error.message)
            );
        } else if (!mainListKey) {
          console.log("Adding new main list");
          let newMainListKey = shoppingListsRef
            .push({
              title: mainListTitle,
              createdBy: { id: userID, displayName: username },
              owners: [{ id: userID, displayName: username }]
            })
            .then(result => {
              shoppingListsRef
                .child(result.key)
                .child("subLists")
                .push({ title })
                .then(result => {
                  console.log("Successfully added new mainlist");
                  componentThis.editMode = false;
                  componentThis.$emit("update");
                });
            });
        } else {
          console.log(
            "Something went wrong while trying to add/update sublist"
          );
        }
      } else {
        console.log("Closing editMode");
        this.toggleEditMode();
      }
    }
  },
  directives: {
    ClickOutside
  },
  mounted() {
    if (this.subListKey === "") {
      this.isNew = true;
      this.saveTitle();
    }
  }
};
</script>
