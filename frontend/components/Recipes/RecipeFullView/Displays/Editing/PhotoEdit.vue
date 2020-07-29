<template>
  <image-input class="recipe-photo" @uploaded="uploadImage" />
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
      var imageName = uuid.v1();
      let recipeKey = this.recipeKey;
      this.$emit("loading");
      try {
        //upload image
        let file = upload;
        var metadata = {
          contentType: "image/png"
        };
        var storageRef = this.$fireStorage.ref();
        var imageRef = storageRef.child(
          `images/recipes/${recipeKey}/${imageName}.png`
        );
        await imageRef.put(file, metadata);
        await imageRef.getDownloadURL().then(result => {
          this.$emit("save", result);
        });
      } catch (error) {
        console.log("Error updating recipe image:", error.message);
      }
    },
    removeRecipeImg() {
      let recipeKey = this.recipeKey;
      var storageRef = this.$fireStorage.ref();
      var imageRef = storageRef.child(`images/recipes/${recipeKey}`);
      imageRef
        .listAll()
        .then(function(res) {
          res.items.forEach(function(itemRef) {
            itemRef.delete();
          });
        })
        .catch(function(error) {
          console.log("Error deleting files:", error.message);
        });
    }
  }
};
</script>
