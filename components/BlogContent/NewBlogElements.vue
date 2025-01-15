<template>
    <div class="blog-edit">
        <div v-for="element in newContent" :key="element[0]">
            <div v-if="element[1].type === 'image'" class="input-wrap">
                <blog-image-input   :element="element"
                                    :recipe-key="recipeKey" 
                                    @update="payload => $emit('update', payload)" 
                                    @close="removeInactiveInput"
                                    @delete="removeInactiveInput"
                />
            </div>
            <div v-else class="input-wrap">
                <blog-text-input    :element="element" 
                                    :recipe-key="recipeKey" 
                                    @update="payload => $emit('update', payload)" 
                                    @close="removeInactiveInput"
                                    @delete="removeInactiveInput"
                />
            </div>
        </div>

        <expand :show="selectingHeadline">
            <div class="headline-selector">
                <div class="title">{{ $t('recipes.blog.pickHeadline') }}:</div>
                <h2 @click.stop="selectHeadline('large')">{{ $t('recipes.blog.largeHeadline') }}</h2>
                <h3 @click.stop="selectHeadline('medium')">{{ $t('recipes.blog.mediumHeadline') }}</h3>
                <h4 @click.stop="selectHeadline('small')">{{ $t('recipes.blog.smallHeadline') }}</h4>
            </div>
        </expand>

        <div class="add-buttons">
            <button class="button button--increment" @click="selectingHeadline = true">
                {{$t('recipes.blog.addHeadline')}}
            </button>
            <button class="button button--increment" @click="addImage">
                {{$t('recipes.blog.addImage')}}
            </button>
            <button class="button button--increment" @click="addText">
                {{$t('recipes.blog.addText')}}
            </button>
        </div>
    </div>
</template>

<script>
const uuid = require('uuid');

import user from "~/composables/user";
import BlogTextInput from "./Editing/BlogTextInput.vue";
import BlogImageInput from "./Editing/BlogImageInput.vue";
import Expand from '../Transitions/Expand.vue';

export default {
    name: "new-blog-elements",
    components: {
        BlogTextInput,
        BlogImageInput,
        Expand
    },
    props: {
        recipeKey: String,
        endPosition: Number
    },
    data() {
        return {
            newContent: [],
            selectingHeadline: false
        }
    },
    mixins: [user],
    methods: {
        selectHeadline(size) {
            let key = uuid.v1();

            this.newContent.push([key, {
                position: this.getPosition(),
                type: "headline",
                size,
                content: '',
                new: true
            }]);
            this.selectingHeadline = false;
        },
        addImage() {
            this.selectingHeadline = false;
            let openImageInput = this.newContent.filter(elem =>  elem[1].type === 'image');

            if(!openImageInput.length) {
                let key = uuid.v1();
                this.newContent.push([key, {
                    position: this.getPosition(),
                    type: "image",
                    content: '',
                    caption: '',
                    new: true
                }]);
            }
        },
        addText() {
            this.selectingHeadline = false;
            let key = uuid.v1();
            this.newContent.push([key, {
                position: this.getPosition(),
                type: "text",
                content: '',
                new: true
            }]);
        },
        getPosition(){
            return this.newContent.length && (this.endPosition + this.newContent.length) || this.endPosition;
        },
        removeInactiveInput(key) {
            this.newContent = this.newContent.filter(elem => elem[0] !== key)
        }
    }
}
</script>