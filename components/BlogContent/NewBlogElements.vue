<template>
  <div class="blog-edit">
    <div v-for="element in newContent" :key="element[0]">
      <div v-if="element[1].type === 'image'" class="input-wrap">
        <BlogImageInput
          :element="element"
          :recipe-key="recipeKey"
          @update="(payload) => emit('update', payload)"
          @close="removeInactiveInput"
          @delete="removeInactiveInput"
        />
      </div>
      <div v-else class="input-wrap">
        <BlogTextInput
          :element="element"
          :recipe-key="recipeKey"
          @update="(payload) => emit('update', payload)"
          @close="removeInactiveInput"
          @delete="removeInactiveInput"
        />
      </div>
    </div>

    <Expand :show="selectingHeadline">
      <div class="headline-selector">
        <div class="title">{{ $t("recipes.blog.pickHeadline") }}:</div>
        <h2 @click.stop="selectHeadline('large')">
          {{ $t("recipes.blog.largeHeadline") }}
        </h2>
        <h3 @click.stop="selectHeadline('medium')">
          {{ $t("recipes.blog.mediumHeadline") }}
        </h3>
        <h4 @click.stop="selectHeadline('small')">
          {{ $t("recipes.blog.smallHeadline") }}
        </h4>
      </div>
    </Expand>

    <div class="add-buttons">
      <button
        class="button button--increment"
        @click="selectingHeadline = true"
      >
        {{ $t("recipes.blog.addHeadline") }}
      </button>
      <button class="button button--increment" @click="addImage">
        {{ $t("recipes.blog.addImage") }}
      </button>
      <button class="button button--increment" @click="addText">
        {{ $t("recipes.blog.addText") }}
      </button>
    </div>
  </div>
</template>

<script setup>
const uuid = require("uuid");

import BlogTextInput from "./Editing/BlogTextInput.vue";
import BlogImageInput from "./Editing/BlogImageInput.vue";
import Expand from "../Transitions/Expand.vue";

const emit = defineEmits(["update"]);
const props = defineProps({
  recipeKey: {
    type: String,
    required: true,
  },
  endPosition: {
    type: Number,
    default: 0,
  },
});

const newContent = ref([]);
const selectingHeadline = ref(false);

function selectHeadline(size) {
  const key = uuid.v1();

  newContent.value.push([
    key,
    {
      position: getPosition(),
      type: "headline",
      size,
      content: "",
      new: true,
    },
  ]);
  selectingHeadline.value = false;
}

function addImage() {
  selectingHeadline.value = false;
  let openImageInput = newContent.value.filter(
    (elem) => elem[1].type === "image"
  );

  if (!openImageInput.length) {
    let key = uuid.v1();
    newContent.value.push([
      key,
      {
        position: getPosition(),
        type: "image",
        content: "",
        caption: "",
        new: true,
      },
    ]);
  }
}

function addText() {
  selectingHeadline.value = false;
  const key = uuid.v1();
  newContent.value.push([
    key,
    {
      position: getPosition(),
      type: "text",
      content: "",
      new: true,
    },
  ]);
}

function getPosition() {
  return (
    (newContent.value.length && props.endPosition + newContent.value.length) ||
    props.endPosition
  );
}

function removeInactiveInput(key) {
  newContent.value = newContent.value.filter((elem) => elem[0] !== key);
}
</script>
