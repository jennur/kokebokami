<template>
    <section class="blog-content">
        <button v-if="isRecipeOwner && (!addingNewBlog && !blog)"
                class="button button--increment"
                @click="addingNewBlog = true"
        >
            {{ $t('recipes.blog.addContent') }}
        </button>

        <div v-for="element in content" :key="element[0]">
            <div v-if="element[1].type === 'headline'" class="headline-wrap">
                <component :is="headlineSize(element[1].size)" v-if="editHeadline !== element[0]"
                    class="headline"
                    :class="{ 'editable': isRecipeOwner }"
                    @click.stop="isRecipeOwner && (editHeadline = element[0])"
                >
                    {{element[1].content}}
                </component>

                <blog-text-input v-else
                                :element="element"
                                :recipe-key="recipeKey"
                                @close="editHeadline = null"
                                @update="$emit('update')"
                                @delete="key => deleteFromDB(key)"
                />
            </div>

            <div v-if="element[1].type === 'image'" class="image-wrap">
                <img    v-if="editImage !== element[0]"
                        :src="element[1].content"
                        :class="{'editable': isRecipeOwner }"
                        @click.stop="isRecipeOwner && (editImage = element[0])"
                />
                <div v-if="editImage !== element[0] && element[1].caption" class="caption">
                    {{$t('photo')}}: {{element[1].caption}}
                </div>
                <blog-image-input v-if="editImage === element[0]"
                                :element="element"
                                :recipe-key="recipeKey"
                                @close="editImage = null"
                                @update="$emit('update')"
                                @delete="key => deleteImage(element[0])"
                />
            </div>

            <div v-if="element[1].type === 'text'" class="text-wrap">
                <p  v-if="editText !== element[0]"
                    :class="{'editable': isRecipeOwner }"
                    @click.stop="isRecipeOwner && (editText = element[0])"
                >
                    {{ element[1].content }}
                </p>

                <blog-text-input v-else
                                :element="element"
                                :recipe-key="recipeKey"
                                @close="editText = null"
                                @update="$emit('update')"
                                @delete="key => deleteFromDB(key)"
                />
            </div>
        </div>

        <new-blog-elements  v-if="isRecipeOwner && (addingNewBlog || blog)"
                            :content="content"
                            :end-position="content && content.length || 0"
                            :recipe-key="recipeKey"
                            @update="payload => $emit('update', payload)"
                            class="new-blog-elements"
        />

        <div v-if="blog" class="blog-divider" id="recipeSection">
            <span class="label">{{ $t('recipe') }}</span>
        </div>
    </section>
</template>

<script>
import { getDatabase, ref, get } from "firebase/database";
import user from "~/composables/user";
import BlogImageInput from './Editing/BlogImageInput.vue';
import BlogTextInput from './Editing/BlogTextInput.vue';
import NewBlogElements from "./NewBlogElements.vue";

export default {
    name: "blog-section",
    components: {
        BlogTextInput,
        NewBlogElements,
        BlogImageInput
    },
    props: {
        recipeTitle: String,
        blog: Object,
        isRecipeOwner: Boolean,
        recipeKey: String
    },
    data() {
        return {
            addingNewBlog: false,
            editHeadline: null,
            editImage: null,
            editText: null
        }
    },
    mixins: [user],
    computed: {
        content() {
            return this.blog && Object.entries(this.blog).sort((a, b) => (a[1].position > b[1].position) ? 1 : -1);
        }
    },
    methods: {
        headlineSize(size) {
            switch(size) {
                case 'large':
                    return 'h2';
                case 'medium':
                    return 'h3';
                case 'small':
                    return 'h4';
                default:
                    return 'h2';
            }
        },
        deleteImage(key){
            // Delete from storage
            if (this.recipeKey) {
                //remove image from blog content
                var storageRef = this.$fire.storageref(db, );
                let imageRef = storageRef.child(`images/recipes/${this.recipeKey}/${key}.jpeg`);

                imageRef.delete()
                    .then(() => {
                        console.log("Successfully deleted image");
                        this.deleteFromDB(key)
                    })
                    .catch(error =>
                    console.log("Error deleting image:", error.message)
                    );
            }
        },
        deleteFromDB(key){
            const db = getDatabase();
            let blogRef = ref(db, `recipes/${this.recipeKey}/blog`);

            ref(db, `recipes/${this.recipeKey}/blog/${key}`)
                .remove()
                .then(() =>  {
                    console.log("Deleted element from db");
                    blogRef.orderByChild('position').once('value', snapshot => {
                        //Reindex elements
                        let reIndexedElems = {};
                        let index = 0;
                        snapshot && snapshot.forEach((elem) => {
                            reIndexedElems[elem.key] = {
                                ...elem.val(),
                                position: index
                            }
                            index++
                        })
                        console.log("Reindexed elements");
                        blogRef.set(reIndexedElems);
                    })
                    this.$emit('update');
                })
                .catch(error => console.log("Error deleting element from db:", error.message));
        }
    }
}
</script>
