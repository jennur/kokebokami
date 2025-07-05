<template>
  <div>
    <div class="image-input-wrap">
      <ImageInput
        class="image-input"
        :url="element[1].content || imageURL"
        @uploaded="saveImage"
      />
      <span v-if="loading" class="simple-loading-spinner"></span>
      <DecrementButton @decrement="emit('delete', element[0])" />
    </div>
    <div class="caption">
      {{ $t("recipes.blog.photoCredit") }}:
      <input type="text" class="image-caption" v-model="caption" />
      <button
        class="button button-xs"
        @click="saveCaption"
        :disabled="!element[1].content && !uploaded"
      >
        {{ $t("save") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import Compressor from "compressorjs";
import { getDatabase, ref as dbRef, set } from "firebase/database";
import {
  getStorage,
  getDownloadURL,
  uploadBytes,
  ref as storageRef,
} from "firebase/storage";
import ImageInput from "../../Input/ImageInput.vue";
import DecrementButton from "../../Input/DecrementButton.vue";

const emit = defineEmits(["close", "update", "delete"]);
const props = defineProps({
  recipeKey: {
    type: String,
    default: "",
  },
  element: {
    type: Array,
    default: () => [],
  },
});

const loading = ref(false);
const uploaded = ref(false);
const imageURL = ref("");
const caption = ref(
  (props.element[1].caption &&
    JSON.parse(JSON.stringify(props.element[1].caption))) ||
    ""
);

function saveCaption() {
  const db = getDatabase();
  const key = props.element[0];
  if (props.recipeKey) {
    const captionRef = dbRef(
      db,
      `recipes/${props.recipeKey}/blog/${key}/caption`
    );
    set(captionRef, caption.value)
      .then(() => {
        console.info("[saveCaption] Successfully saved caption to element");
        emit("close", key);
        emit("update");
      })
      .catch((error) => console.error("[saveCaption]", error.message));
  } else {
    blog[key] = { caption: caption.value };
    emit("update", { blog });
  }
}

async function saveImage(file) {
  new Compressor(file, {
    checkOrientation: true,
    maxWidth: 1000,
    maxHeight: 800,
    quality: 0.8,
    // Convert ALL PNG images to JPEG
    convertSize: 0,
    success(result) {
      console.log(
        "[handlePictureUpload] Image successfully compressed",
        result
      );
      saveToStorage(result);
    },
    error(error) {
      console.error("[handlePictureUpload]", error.message);
    },
  });

  async function saveToStorage(upload) {
    try {
      loading.value = true;
      const key = props.element[0];
      const content = props.element[1];

      const file = upload;
      const metadata = {
        contentType: "image/jpeg",
      };
      const storage = getStorage();
      const imageRef = storageRef(
        storage,
        `images/recipes/${props.recipeKey}/${key}.jpeg`
      );

      await uploadBytes(imageRef, file, metadata);
      const downLoadUrl = await getDownloadURL(imageRef);
      imageURL.value = downLoadUrl;

      console.info("[saveImage] Uploaded image", downLoadUrl);

      const imageObj = {
        position: content.position,
        type: "image",
        content: downLoadUrl,
      };

      saveToDb(imageObj, key);
    } catch (error) {
      console.error("[saveImage]", error.message);
    } finally {
      loading.value = false;
    }
  }

  function saveToDb(imageObj, key) {
    if (props.recipeKey) {
      const db = getDatabase();
      const blogRef = dbRef(db, `recipes/${props.recipeKey}/blog/${key}`);
      set(blogRef, imageObj).then(() => {
        console.info("[saveImage] Successfully saved image to db");
        uploaded.value = true;
      });
    } else {
      const blog = {};
      blog[key] = imageObj;
      emit("update", { blog });
      uploaded.value = true;
    }
  }
}
</script>
