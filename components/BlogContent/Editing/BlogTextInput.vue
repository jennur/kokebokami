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
      <decrement-button @decrement="$emit('delete', element[0])" />
    </div>
    <div v-if="element[1].type === 'text'" class="text-input-wrap">
      <textarea
        v-model="newElement[1].content"
        placeholder="...."
        class="text-input"
        v-click-outside="(event) => saveText(event)"
      />
      <decrement-button @decrement="$emit('delete', element[0])" />
    </div>
  </div>
</template>

<script>
import { getDatabase, ref, get } from "firebase/database";

import DecrementButton from "../../Input/DecrementButton.vue";

export default {
  name: "blog-text-input",
  components: {
    DecrementButton,
  },
  props: {
    recipeKey: String,
    element: Array,
  },
  data() {
    return {
      newElement: JSON.parse(JSON.stringify(this.element)),
    };
  },
  methods: {
    saveText(event) {
      event && event.stopPropagation();
      let key = this.newElement[0];
      let content = this.newElement[1];

      let hasChanged = !this.isSameString(
        content.content,
        this.element[1].content
      );
      if (this.recipeKey) {
        if (hasChanged) {
          console.log("Saving text");
          if (content.new) delete content.new;
          const db = getDatabase();
            ref(db, `recipes/${this.recipeKey}/blog/${key}`)
            .set(content)
            .then(() => {
              console.log("Saved content to db");
              this.$emit("close", key);
              this.$emit("update");
            })
            .catch((error) =>
              console.log("Error saving content to db:", error.message)
            );
        } else {
          if (!content.new) {
            console.log("Not new. No change, closing text edit");
            this.$emit("close", key);
          }
        }
      } else {
        if (content.new) delete content.new;
        let blog = {};
        blog[key] = content;
        this.$emit("close", key);
        this.$emit("update", { blog });
      }
    },
    isSameString(string1, string2) {
      return new String(string1).valueOf() === new String(string2).valueOf();
    },
  },
};
</script>
