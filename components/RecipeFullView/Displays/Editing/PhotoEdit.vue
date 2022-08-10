<template>
  <div>
    <image-input class="recipe-photo" @uploaded="uploadImage" />
  </div>
</template>
<script>
const uuid = require("uuid");
import ImageInput from "~/components/Input/ImageInput.vue";

export default {
  name: "photo-edit",
  components: {
    ImageInput
  },
  props: {
    photoURL: {
      type: String,
      default: ""
    },
    recipeKey: {
      type: String,
      default: ""
    }
  },
  methods: {
    async uploadImage(upload) {
      this.removeRecipeImg();
      var imageKey = uuid.v1();
      let recipeKey = this.recipeKey;

      //Upload image
      let file = upload;
      var metadata = {
        contentType: "image/jpeg"
      };
      var storageRef = this.$fire.storage.ref();
      var imageRef = storageRef.child(`images/recipes/${recipeKey}/${imageKey}.jpeg`);
      await imageRef.put(file, metadata);
      await imageRef
        .getDownloadURL()
        .then(result => {
          console.log("Uploaded image", result);
          this.$emit("loading");

          this.$emit("save", result);
        })
        .catch(error => console.log("Error uploading image:", error.message));
    },
    removeRecipeImg() {
      let recipeKey = this.recipeKey;
      if (recipeKey) {
        let photoRef = this.$fire.database.ref(`recipes/${recipeKey}/photoURL`);
        photoRef.once("value", snapshot => {
          if (snapshot.exists()) {
            let photoURL = snapshot.val();
            if (photoURL !== "") {
              var fileRef = this.$fire.storage.refFromURL(photoURL);
              fileRef
                .delete()
                .then(() => {
                  console.log("Successfully deleted image");
                  photoRef
                    .set("")
                    .then(() => console.log("Updated photoURL in db"))
                    .catch(error =>
                      console.log("Error updating image in db:", error.message)
                    );
                })
                .catch(error =>
                  console.log("Error deleting file:", error.message)
                );
            }
          }
        });
      }
    }
  }
};
</script>
