<template>
  <div>
    <image-input class="recipe-photo" @uploaded="uploadImage" />
  </div>
</template>

<script setup>
import { getDatabase, ref as dbRef, get, set } from "firebase/database";
import {
  getStorage,
  getDownloadURL,
  uploadBytes,
  ref as storageRef,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import ImageInput from "~/components/Input/ImageInput.vue";

const db = getDatabase();
const storage = getStorage();

const emit = defineEmits(["save", "loading"]);

const props = defineProps({
  photoURL: {
    type: String,
    default: "",
  },
  recipeKey: {
    type: String,
    default: "",
  },
});

async function uploadImage(file) {
  try {
    await removeRecipeImg();
    const fileName = uuidv4();
    const recipeKey = props.recipeKey;

    const imageRef = storageRef(
      storage,
      `images/recipes/${recipeKey}/${fileName}.jpeg`
    );
    await uploadBytes(imageRef, file, {
      contentType: "image/png",
    });
    const downLoadUrl = await getDownloadURL(imageRef);

    console.info("[uploadImage] Uploaded image", downLoadUrl);
    emit("loading");
    emit("save", downLoadUrl);
  } catch (error) {
    console.error("[uploadImage]", error.message);
  }
}

async function removeRecipeImg() {
  const recipeKey = props.recipeKey;
  if (recipeKey) {
    try {
      const dbImageRef = dbRef(db, `recipes/${recipeKey}/photoURL`);
      const snapshot = await get(dbRef(db, `recipes/${recipeKey}/photoURL`));
      if (snapshot.exists()) {
        const photoURL = snapshot.val();

        if (photoURL !== "") {
          await deleteObject(storageRef(storage, photoURL));
          console.info("[removeRecipeImg] Successfully deleted image");
          await set(dbImageRef, "");
          console.info("[removeRecipeImg] Updated photoURL in db");
        }
      }
    } catch (error) {
      console.error("[removeRecipeImg]", error.message);
    }
  }
}
</script>
