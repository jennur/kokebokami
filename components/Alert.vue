<template>
  <transition name="fade">
    <div v-if="showAlertWrap" class="alert-box-wrap">
      <transition name="pop-modal">
        <div v-if="showAlertBox" class="alert-box">
          <p>{{ alertMessage }}</p>
          <div class="alert-box_buttons flex-row flex-row--align-center">
            <button
              class="button button-sm button--red-border margin-right-lg"
              @click="emit('confirmed')"
            >
              {{ $t("confirm") }}
            </button>
            <button class="button button-sm" @click="emit('cancel')">
              {{ $t("cancel") }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
const emit = defineEmits(["confirmed", "cancel"]);
const props = defineProps({
  alertMessage: {
    type: String,
    default: "",
  },
  showAlert: {
    type: Boolean,
    default: false,
  },
});

const showAlertWrap = ref(false);
const showAlertBox = ref(false);

const { showAlert } = toRefs(props);

watch(showAlert, (value) => {
  if (value === true) {
    showAlertWrap.value = true;
    setTimeout(() => {
      showAlertBox.value = true;
    }, 10);
  } else {
    showAlertBox.value = false;
    setTimeout(() => {
      showAlertWrap.value = false;
    }, 200);
  }
});
</script>
