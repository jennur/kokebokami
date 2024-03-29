<template>
  <dt class="account_detail account_detail--flex-column">
    <div>
      <h4 class="account_detail-title">
        {{ title }}
        <span v-if="visibleToPublic" class="system-message"
          >({{ $t("accountDetails.visibleToEveryone") }})</span
        >
      </h4>

      <div class="account_detail-value" v-if="!editMode">
        <span v-if="!isImage">{{ currentValue ? currentValue : null }}</span>
        <img
          class="account_detail-picture"
          v-if="isImage && !isLoading"
          :src="currentValue"
        />
        <span v-if="isLoading" class="simple-loading-spinner"></span>
      </div>

      <div v-if="editMode && isImage" class="account_detail-edit">
        <dropzone
          id="dropImage"
          ref="dropImage"
          :options="options"
          :destroyDropzone="true"
          @vdropzone-complete="handlePictureUpload"
        />
        <div class="flex-row">
          <button
            class="button button--w-icon-left button-sm button--cancel account_detail-warning-btn margin-top-md margin-left-sm"
          >
            <delete-icon
              tabindex="0"
              v-if="removeOption && currentValue"
              @click="toggleAlert"
              class="icon icon--in-button icon--in-button-left margin-right-sm"
            />
            {{ $t("delete") }}
          </button>
          <Alert
            alertMessage="You're about to delete your profile picture"
            :showAlert="showAlert"
            @confirmed="handleRemoval"
            @cancel="toggleAlert"
          />
          <button
            class="button button-sm button--cancel account_detail-warning-btn margin-top-md"
            @click="toggleEditMode"
          >
            ✕ {{ $t("cancel") }}
          </button>
        </div>
      </div>
    </div>
    <form
      v-if="editMode && !isImage"
      v-on:submit.prevent
      class="account_detail-edit"
    >
      <fieldset>
        <label>
          <textarea v-if="inputType === 'textarea'" v-model="inputValue" />
          <input
            v-else
            :type="inputType"
            :autocomplete="autocompleteType"
            v-model="inputValue"
          />
        </label>
      </fieldset>
      <fieldset>
        <div class="flex-row flex-row--nowrap margin-top-lg">
          <button @click="handleSave" class="button button--round button-sm">
            {{ $t("save") }}
          </button>
          <button
            class="button button-sm button--cancel"
            @click="toggleEditMode"
          >
            ✕ {{ $t("cancel") }}
          </button>
        </div>
      </fieldset>
    </form>

    <expand-transition :show="!!systemMessage">
      <div class="system-message margin-top-md">{{ systemMessage }}</div>
    </expand-transition>
    <div v-if="!editMode" class="flex-row">
      <edit-icon
        tabindex="0"
        v-if="editOption"
        @click="toggleEditMode"
        class="icon margin-top-lg"
      />
    </div>
  </dt>
</template>
<script>
import Dropzone from "nuxt-dropzone";
import "nuxt-dropzone/dropzone.css";
import Compressor from "compressorjs";

import Alert from "~/components/Alert.vue";
import ExpandTransition from "~/components/Transitions/Expand.vue";

export default {
  name: "account-detail",
  components: {
    ExpandTransition,
    Dropzone,
    Alert
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    visibleToPublic: {
      type: Boolean,
      default: false
    },
    removeOption: {
      type: Boolean,
      default: false
    },
    editOption: {
      type: Boolean,
      default: false
    },
    inputType: {
      type: String,
      default: "text"
    },
    autocompleteType: {
      type: String,
      default: ""
    },
    systemMessage: {
      type: String,
      default: ""
    },
    currentValue: {
      type: String,
      default: ""
    },
    isImage: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    validate: {
      type: Function,
      default: () => true
    }
  },
  data() {
    return {
      editMode: this.editOpen,
      inputValue: this.currentValue,
      options: {
        url: "https://httpbin.org/post",
        acceptedFiles: ".jpg, .jpeg, .png",
        dictDefaultMessage: `<p class='text-default'><i class='fa fa-cloud-upload mr-2'></i> Drag image or Click here</p>
          <p class="form-text">Allowed Files: .jpg, .jpeg, .png</p>
          `,
        maxFiles: 1
      },
      showAlert: false
    };
  },
  methods: {
    toggleAlert() {
      this.showAlert = !this.showAlert;
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    async handleSave() {
      let valid = await this.validate(this.inputValue);
      if(valid){
        this.toggleEditMode();
        this.$emit("update", this.inputValue);
      }
    },
    handleRemoval() {
      this.showAlert = false;
      this.$emit("remove");
      setTimeout(() => {
        this.editMode = false;
      }, 300);
    },
    handlePictureUpload(upload) {
      this.toggleEditMode();
      this.$emit("update", upload);
      this.$refs.dropImage.removeFile(upload);
    }
  }
};
</script>
