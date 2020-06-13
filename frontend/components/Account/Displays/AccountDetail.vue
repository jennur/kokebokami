<template>
  <dt class="account__detail account__detail--flex-column">
    <h4 class="account__detail-title">
      {{title}}
      <span v-if="visibleToPublic" class="system-message">(visible to other users)</span>
    </h4>

    <div class="account__detail-value" v-if="!editMode">
      <span v-if="!isImage">
        {{
        currentValue ? currentValue : null
        }}
      </span>
      <img v-else :src="currentValue" />
    </div>

    <form v-if="editMode" v-on:submit.prevent class="account__detail-edit">
      <fieldset>
        <label v-if="!isImage">
          <textarea v-if="inputType === 'textarea'" v-model="inputValue" />
          <input v-else :type="inputType" :autocomplete="autocompleteType" v-model="inputValue" />
        </label>
      </fieldset>
      <button
        v-if="removeOption"
        @click="$emit('remove')"
        class="button button--small button--cancel margin-top--large"
      >Remove</button>
      <button @click="handleSave" class="button button--small margin-top--large">Save</button>
    </form>
    <expand-transition :show="!!systemMessage">
      <div class="system-message">{{ systemMessage }}</div>
    </expand-transition>
    <button
      v-if="editOption"
      @click="toggleEditMode"
      class="button button--small button--transparent account__detail-edit-btn"
    >{{ editMode ? "Cancel" : "Edit" }}</button>
  </dt>
</template>
<script>
import ExpandTransition from "~/components/Transitions/Expand.vue";
export default {
  name: "account-detail",
  components: {
    ExpandTransition
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
    }
  },
  data() {
    return {
      editMode: false,
      inputValue: this.currentValue
    };
  },
  methods: {
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    handleSave() {
      this.toggleEditMode();
      this.$emit("update", this.inputValue);
    }
  }
};
</script>
