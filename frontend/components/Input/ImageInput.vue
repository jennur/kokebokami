<template>
  <div class="image-upload">
    <dropzone
      id="dropImage"
      ref="dropImage"
      :options="options"
      :destroyDropzone="true"
      @vdropzone-complete="handlePictureUpload"
    />
  </div>
</template>

<script>
import Dropzone from "nuxt-dropzone";
import "nuxt-dropzone/dropzone.css";
import Compressor from "compressorjs";

export default {
  name: "image-input",
  components: {
    Dropzone
  },
  data() {
    return {
      options: {
        url: "https://httpbin.org/post",
        acceptedFiles: ".jpg, .jpeg, .png",
        dictDefaultMessage: `<p class='text-default'><i class='fa fa-cloud-upload mr-2'></i> Drag image or Click here</p>
          <p class="form-text">Allowed Files: .jpg, .jpeg, .png</p>
          `,
        maxFiles: 1
      }
    };
  },
  methods: {
    handlePictureUpload(file) {
      this.isLoading = true;
      let componentThis = this;
      const imageCompressor = new Compressor(file, {
        checkOrientation: true,
        maxWidth: 1000,
        maxHeight: 800,
        quality: 0.8,
        // Convert ALL PNG images to JPEG
        convertSize: 0,
        success(result) {
          componentThis.$emit("uploaded", result);
          componentThis.$refs.dropImage.removeFile(file);
        },
        error(error) {
          console.log("Error compressing image:", error.message);
        }
      });
    }
  }
};
</script>
