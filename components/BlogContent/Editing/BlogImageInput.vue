<template>
    <div>
        <div class="image-input-wrap">
            <image-input    class="image-input"
                            :style="`background-image: url(${element[1].content || imageURL})`"
                            @uploaded="saveImage"
            />
            <span v-if="loading" class="simple-loading-spinner"></span>
            <decrement-button @decrement="$emit('delete', element[0])"/>
        </div>
        <div class="caption">
            {{ $t('recipes.blog.photoCredit') }}: <input type="text" class="image-caption" v-model="caption"/>
            <button class="button button-xs"
                    @click="saveCaption"
                    :disabled="!element[1].content && !uploaded"
            >
                {{ $t('save') }}
            </button>
        </div>
    </div>
</template>

<script>
import ImageInput from "../../Input/ImageInput.vue";
import DecrementButton from '../../Input/DecrementButton.vue';

export default {
    name: 'blog-image-input',
    components: {
        ImageInput,
        DecrementButton
    },
    props: {
        recipeKey: String,
        element: Array
    },
    data() {
        return {
            loading: false,
            uploaded: false,
            imageURL: "",
            caption: this.element[1].caption && JSON.parse(JSON.stringify(this.element[1].caption)) || ""
        }
    },
    methods: {
        saveCaption(){
            let key = this.element[0];
            if(this.recipeKey) {
              this.$fire.database.ref(`recipes/${this.recipeKey}/blog/${key}/caption`)
                .set(this.caption)
                .then(() =>  {
                    console.log("Saved caption to element");
                    this.$emit('close', key);
                    this.$emit('update');
                })
                .catch(error => console.log("Error saving content to db:", error.message));
            } else {
              blog[key] = { caption: this.caption }
              this.$emit('update', { blog })
            }
        },
        async saveImage(upload){
            this.loading = true;
            let key = this.element[0];
            let content = this.element[1];

            let file = upload;
            let metadata = {
                contentType: "image/jpeg"
            };

            let storageRef = this.$fire.storage.ref();
            let imageRef = storageRef.child(`images/recipes/${this.recipeKey}/${key}.jpeg`);

            await imageRef.put(file, metadata);
            await imageRef
                .getDownloadURL()
                .then(result => {
                    console.log("Uploaded image", result);
                    this.imageURL = result;
                    if(this.recipeKey){
                        this.$fire.database.ref(`recipes/${this.recipeKey}/blog/${key}`)
                        .set({
                            position: content.position,
                            type: 'image',
                            content: result
                        })
                        .then(() => {
                            console.log("Saved image to db");
                            this.uploaded = true;
                            this.loading = false;
                        })
                        .catch(error => console.log("Error saving image to db:", error.message));
                      } else {
                        let blog = {};
                        blog[key] = {
                                    position: content.position,
                                    type: 'image',
                                    content: result
                                }
                        this.$emit('update', { blog })
                        this.uploaded = true;
                        this.loading = false;
                    }
                })
                .catch(error => console.log("Error uploading image:", error.message));
        }
    }
}
</script>
