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
        <ImageInput @uploaded="handlePictureUpload" />
        <!-- <Dropzone
          id="dropImage"
          ref="drop-image"
          :options="options"
          :destroyDropzone="true"
          @vdropzone-complete="handlePictureUpload"
        /> -->
        <div class="flex-row">
          <button
            class="button button--w-icon-left button-sm button--cancel account_detail-warning-btn margin-top-md margin-left-sm"
          >
            <i-delete-icon
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

    <ExpandTransition :show="!!systemMessage">
      <div class="system-message margin-top-md">{{ systemMessage }}</div>
    </ExpandTransition>

    <div v-if="!editMode" class="flex-row">
      <i-edit-icon
        tabindex="0"
        v-if="editOption"
        @click="toggleEditMode"
        class="icon margin-top-lg"
      />
    </div>
  </dt>
</template>

<script setup>
import Alert from "~/components/Alert.vue";
import ExpandTransition from "~/components/Transitions/Expand.vue";
import ImageInput from "../../Input/ImageInput.vue";

const emit = defineEmits(["update", "remove"]);
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  visibleToPublic: {
    type: Boolean,
    default: false,
  },
  removeOption: {
    type: Boolean,
    default: false,
  },
  editOption: {
    type: Boolean,
    default: false,
  },
  inputType: {
    type: String,
    default: "text",
  },
  autocompleteType: {
    type: String,
    default: "",
  },
  systemMessage: {
    type: String,
    default: "",
  },
  currentValue: {
    type: String,
    default: "",
  },
  isImage: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  validate: {
    type: Function,
    default: () => true,
  },
});

const editMode = ref(false);
const inputValue = ref(props.currentValue);
const showAlert = ref(false);

function toggleAlert() {
  showAlert.value = !showAlert.value;
}

function toggleEditMode() {
  editMode.value = !editMode.value;
}

async function handleSave() {
  const valid = await props.validate(inputValue.value);
  if (valid) {
    toggleEditMode();
    emit("update", inputValue.value);
  }
}

function handleRemoval() {
  showAlert.value = false;
  emit("remove");
  setTimeout(() => {
    editMode.value = false;
  }, 300);
}

function handlePictureUpload(upload) {
  toggleEditMode();
  emit("update", upload);
}
</script>
