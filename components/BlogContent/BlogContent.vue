<template>
  <section class="blog-content">
    <button
      v-if="isRecipeOwner && !addingNewBlog && !blog"
      class="button button--increment"
      @click="addingNewBlog = true"
    >
      {{ $t("recipes.blog.addContent") }}
    </button>

    <div v-for="element in content" :key="element[0]">
      <div v-if="element[1].type === 'headline'" class="headline-wrap">
        <component
          :is="headlineSize(element[1].size)"
          v-if="editHeadline !== element[0]"
          class="headline"
          :class="{ editable: isRecipeOwner }"
          @click.stop="isRecipeOwner && (editHeadline = element[0])"
        >
          {{ element[1].content }}
        </component>

        <BlogTextInput
          v-else
          :element="element"
          :recipe-key="recipeKey"
          @close="editHeadline = null"
          @update="$emit('update')"
          @delete="(key) => deleteBlogElementFromDB(key)"
        />
      </div>

      <div v-if="element[1].type === 'image'" class="image-wrap">
        <img
          v-if="editImage !== element[0]"
          :src="element[1].content"
          :class="{ editable: isRecipeOwner }"
          @click.stop="isRecipeOwner && (editImage = element[0])"
        />
        <div
          v-if="editImage !== element[0] && element[1].caption"
          class="caption"
        >
          {{ $t("photo") }}: {{ element[1].caption }}
        </div>
        <BlogImageInput
          v-if="editImage === element[0]"
          :element="element"
          :recipe-key="recipeKey"
          @close="editImage = null"
          @update="$emit('update')"
          @delete="(key) => deleteBlogImage(element[0])"
        />
      </div>

      <div v-if="element[1].type === 'text'" class="text-wrap">
        <p
          v-if="editText !== element[0]"
          :class="{ editable: isRecipeOwner }"
          @click.stop="isRecipeOwner && (editText = element[0])"
        >
          {{ element[1].content }}
        </p>

        <BlogTextInput
          v-else
          :element="element"
          :recipe-key="recipeKey"
          @close="editText = null"
          @update="$emit('update')"
          @delete="(key) => deleteBlogElementFromDB(key)"
        />
      </div>
    </div>

    <NewBlogElements
      v-if="isRecipeOwner && (addingNewBlog || blog)"
      :content="content"
      :end-position="(content && content.length) || 0"
      :recipe-key="recipeKey"
      @update="(payload) => $emit('update', payload)"
      class="new-blog-elements"
    />

    <div v-if="blog" class="blog-divider" id="recipeSection">
      <span class="label">{{ $t("recipe") }}</span>
    </div>
  </section>
</template>

<script setup>
import { getDatabase, ref, get } from "firebase/database";
import { ref as storageRef, getStorage } from "firebase/storage";
import BlogImageInput from "./Editing/BlogImageInput.vue";
import BlogTextInput from "./Editing/BlogTextInput.vue";
import NewBlogElements from "./NewBlogElements.vue";

const props = defineProps({
  recipeTitle: {
    type: String,
    default: ""
  },
  blog: {
    type: Object,
    default: () => {}
  },
  isRecipeOwner: {
    type: Boolean,
    default: false
  },
  recipeKey: {
    type: String,
    required: true
  },
})

const addingNewBlog = ref(false);
const editHeadline = ref(null);
const editImage = ref(null);
const editText = ref(null);

const content = computed(() => {
  return (
    props.blog &&
    Object.entries(props.blog).sort((a, b) =>
      a[1].position > b[1].position ? 1 : -1
    )
  );
});

function headlineSize(size) {
  switch (size) {
    case "large":
      return "h2";
    case "medium":
      return "h3";
    case "small":
      return "h4";
    default:
      return "h2";
  }
}

function deleteBlogImage(key) {
  if (props.recipeKey) {
    const storage = getStorage();
    // Delete from storage
    deleteObject(storageRef(storage, `images/recipes/${props.recipeKey}/${key}.jpeg`))
      .then(() => {
        console.info("[deleteBlogImage] Successfully deleted image");
        // Remove image from blog content
        deleteBlogElementFromDB(key);
      })
      .catch((error) => console.error("[deleteBlogImage]", error.message));
  }
}

function deleteBlogElementFromDB(key) {
  const db = getDatabase();
  const blogRef = ref(db, `recipes/${props.recipeKey}/blog`);

  remove(ref(db, `recipes/${props.recipeKey}/blog/${key}`))
    .then(() => {
      console.log(`[deleteBlogElementFromDB] Deleted ${key} from db`);
      query(blogRef, orderByChild("position"))
      .then((snapshot) => {
          //Reindex elements
          let reIndexedElems = {};
          let index = 0;
          snapshot &&
            snapshot.forEach((elem) => {
              reIndexedElems[elem.key] = {
                ...elem.val(),
                position: index,
              };
              index++;
            });
          console.info("[deleteBlogElementFromDB] Reindexed elements");
          set(blogRef, reIndexedElems);
        })
        emit("update");
    })
    .catch((error) =>
      console.error("[deleteBlogElementFromDB]", error.message)
    );
}
</script>
