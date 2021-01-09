<template>
  <div>
    <fieldset v-if="!saved">
      <div class="flex-row flex-row--align-center flex-row--justify-center">
        <button
          @click="toggleAlert"
          class="button button-sm button--cancel margin-top--xxlarge"
        >
          ✕ {{ $t("cancel") }}
        </button>
        <Alert
          :alertMessage="
            editMode
              ? 'Are you sure you want to discard the changes?'
              : 'Are you sure you want to discard your new recipe?'
          "
          :showAlert="showAlert"
          @confirmed="$emit('cancel')"
          @cancel="toggleAlert"
        />
        <button
          @click="$emit('save')"
          class="button button-sm margin-top--xxlarge"
        >
          Save
        </button>
      </div>
      <div class="system-message">{{ systemMessage }}</div>
      <nuxt-link v-if="deleted" to="/account/my-cookbook/"
        >Go back to your cookbook</nuxt-link
      >
    </fieldset>

    <div
      class="flex-center-container flex-center-container--column margin--auto"
      v-else-if="saved && recipeKey"
    >
      <div class="system-message">{{ systemMessage }}</div>
      <nuxt-link v-if="recipeKey !== ''" :to="'/recipes/' + recipeKey"
        >Look at your new recipe ➔</nuxt-link
      >
    </div>
  </div>
</template>
<script>
import Alert from "~/components/Alert.vue";
export default {
  name: "save-actions",
  components: {
    Alert
  },
  props: {
    recipeKey: { type: String, default: "" },
    editMode: { type: Boolean, default: false },
    saved: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    systemMessage: { type: String, default: "" }
  },
  data() {
    return {
      showAlert: false
    };
  },
  methods: {
    toggleAlert() {
      this.showAlert = !this.showAlert;
    }
  }
};
</script>
