<template>
  <div class="image-upload">
    <SixDropzone
      v-if="!url"
      id="six-dropzone"
      v-model="image"
      @change="handlePictureUpload"
      :accept="['image/png', 'image/jpeg']"
    ></SixDropzone>
    <img v-else :src="url" class="uploaded-image" />
  </div>
</template>

<script setup>
import Compressor from "compressorjs";

const emit = defineEmits(["uploaded"]);

const props = defineProps({
  url: {
    type: String,
    default: "",
  },
});

const image = ref(null);

function handlePictureUpload(file) {
  emit("uploaded", file);
  // new Compressor(file, {
  //   checkOrientation: true,
  //   maxWidth: 1000,
  //   maxHeight: 800,
  //   quality: 0.8,
  //   // Convert ALL PNG images to JPEG
  //   convertSize: 0,
  //   success(result) {
  //     console.log(
  //       "[handlePictureUpload] Image successfully compressed",
  //       result
  //     );
  //     emit("uploaded", result);
  //   },
  //   error(error) {
  //     console.error("[handlePictureUpload]", error.message);
  //   },
  // });
}
</script>
