<template>
  <section class="modal" :class="{ 'modal--open': open }">
    <transition name="pop-modal">
      <div
        v-if="open"
        class="modal-box margin-h-md"
        :class="{ 'bright-bg': !darkBg }"
      >
        <button
          v-if="closeOption"
          @click="emit('close')"
          class="remove-icon modal--close"
        ></button>

        <slot></slot>
      </div>
    </transition>
  </section>
</template>

<script setup>
const emit = defineEmits(["close"]);
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  closeOption: {
    type: Boolean,
    default: true,
  },
  darkBg: {
    type: Boolean,
    default: true,
  },
});
</script>
