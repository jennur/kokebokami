<template>
  <transition name="fade">
    <div v-if="showAlertWrap" class="alert-box-wrap">
      <transition name="pop-modal">
        <div v-if="showAlertBox" class="alert-box">
          <p>{{ alertMessage }}</p>
          <div class="alert-box_buttons flex-row flex-row--align-center">
            <button
              class="button button-sm button--red-border margin-right-lg"
              @click="$emit('confirmed')"
            >
              {{ $t("confirm") }}
            </button>
            <button class="button button-sm" @click="$emit('cancel')">
              {{ $t("cancel") }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: "alert",
  props: {
    alertMessage: {
      type: String,
      default: ""
    },
    showAlert: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showAlertWrap: false,
      showAlertBox: false
    };
  },
  watch: {
    showAlert: function(val) {
      if (val === true) {
        this.showAlertWrap = true;
        setTimeout(() => {
          this.showAlertBox = true;
        }, 10);
      } else {
        this.showAlertBox = false;
        setTimeout(() => {
          this.showAlertWrap = false;
        }, 200);
      }
    }
  }
};
</script>
