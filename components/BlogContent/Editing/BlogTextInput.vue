<template>
  <div>
    <div v-if="element[1].type === 'headline'" class="text-input-wrap">
      <input
        type="text"
        :class="`headline-input ${element[1].size}`"
        v-model="newElement[1].content"
        placeholder="..."
        v-click-outside="(event) => saveText(event)"
      />
      <decrement-button @decrement="emit('delete', element[0])" />
    </div>
    <div v-if="element[1].type === 'text'" class="text-input-wrap">
      <textarea
        v-model="newElement[1].content"
        placeholder="...."
        class="text-input"
        v-click-outside="(event) => saveText(event)"
      ></textarea>
      <decrement-button @decrement="emit('delete', element[0])" />
    </div>
  </div>
</template>

<script setup>
import { getDatabase, ref as dbRef, set } from "firebase/database";

import DecrementButton from "../../Input/DecrementButton.vue";

const emit = defineEmits(["close", "update", "delete"]);
const props = defineProps({
  recipeKey: {
    type: String,
    default: "",
  },
  element: {
    type: Array,
    default: () => [],
  },
});

const newElement = ref(JSON.parse(JSON.stringify(props.element)));

function saveText(event) {
  event && event.stopPropagation();
  const key = newElement.value[0];
  const content = newElement.value[1];
  const prevContent = props.element[1].content;

  const hasChanged = !isSameString(content.content, prevContent);

  if (props.recipeKey) {
    if (hasChanged) {
      console.info("[saveText] Saving text");
      if (content.new) delete content.new;
      const db = getDatabase();
      const blogRef = dbRef(db, `recipes/${props.recipeKey}/blog/${key}`);
      set(blogRef, content)
        .then(() => {
          console.info("[saveText] Saved new content");
          emit("close", key);
          emit("update");
        })
        .catch((error) => console.error("[saveText]", error.message));
    } else {
      if (!content.new) {
        console.info("[saveText] Not new. No change, closing text edit");
        emit("close", key);
      }
    }
  } else {
    if (content.new) delete content.new;
    let blog = {};
    blog[key] = content;
    emit("close", key);
    emit("update", { blog });
  }
}

function isSameString(string1, string2) {
  return new String(string1).valueOf() === new String(string2).valueOf();
}
</script>
