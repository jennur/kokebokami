<template>
  <div class="accordion">
    <div class="accordion_tab margin-bottom-md" @click="emit('toggle')">
      <span class="recipe-link-list_headline margin--none">
        <downArrow v-if="open" class="icon icon-sm margin-right-md" />
        <rightArrow v-else class="icon icon-sm margin-right-md" />
        {{ title }}
      </span>

      <button
        class="button--increment button--increment-small margin-left-md"
        @click="(event) => addNewLink(event)"
      >
        Add link
      </button>
    </div>

    <expand-transition :show="open">
      <slot></slot>
    </expand-transition>
  </div>
</template>

<script setup>
import rightArrow from "assets/graphics/icons/right-arrow.svg";
import downArrow from "assets/graphics/icons/down-arrow.svg";
import ExpandTransition from "~/components/Transitions/Expand.vue";

const emit = defineEmits(["add-link", "toggle"]);

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  open: {
    type: Boolean,
    default: false,
  },
});

function addNewLink(event) {
  event && event.stopPropagation();
  console.info("[addNewLink] Adding new");
  emit("add-link");
}
</script>
