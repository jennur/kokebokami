<template>
  <section class="modal" :class="{'modal--open': open}">
    <transition name="pop-modal">
      <div v-if="open" class="modal-box margin-horizontal-md" :class="{'bright-bg': !darkBg}">
        <button v-if="closeOption" @click="$emit('close')" class="remove-icon modal--close"></button>

        <slot></slot>
      </div>
    </transition>
  </section>
</template>

<script>
export default {
  name: "modal-box",
  props: {
    open: {
      type: Boolean,
      default: false
    },
    closeOption: {
      type: Boolean,
      default: true
    },
    darkBg: {
      type: Boolean,
      default: true
    }
  }
}
</script>
