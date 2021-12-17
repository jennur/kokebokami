<template>
    <section class="prep-time-wrapper">
        <div v-if="(prepTime || isRecipeOwner) && !editPrepTime" class="prep-time">
            <b>{{ $t('recipes.preptime')}}:</b>  {{ getTimeText(prepTime) }}
            <edit-icon
                tabindex="0"
                v-if="isRecipeOwner && !editPrepTime"
                @click="editPrepTime = true"
                class="icon margin-left-md"
            />
        </div>
        <prep-time-edit v-if="editPrepTime" :time="prepTime" @save-time="time => savePrepTime('prepTime', time)"/>

        <div v-if="(cookingTime || isRecipeOwner) && !editCookingTime" class="prep-time">
            <b>{{ $t('recipes.cookingTime')}}:</b> {{ getTimeText(cookingTime) }}
            <edit-icon
                tabindex="0"
                v-if="isRecipeOwner && !editCookingTime"
                @click="editCookingTime = true"
                class="icon margin-left-md"
            />
        </div>
        <prep-time-edit v-if="editCookingTime" :time="cookingTime" @save-time="time => savePrepTime('cookingTime', time)"/>
        <div  v-if="prepTime && cookingTime" class="prep-time">
           <fa :icon="['far', 'clock']"
                style="font-size:15px;margin-right:3px;cursor:pointer;"
            />
         <b>{{$t('recipes.totalTime')}}:</b> {{ totalTime }}
        </div>
    </section>
</template>

<script>
import PrepTimeEdit from "./Editing/PrepTimeEdit";
import getTotalTime from "~/helpers/get-total-time.js";
export default {
    name: "prep-time",
    components: {
        PrepTimeEdit
    },
    props: {
        prepTime: Object,
        cookingTime: Object,
        isRecipeOwner: Boolean,
        recipeKey: String
    },
    data(){
        return {
            editPrepTime: false,
            editCookingTime: false
        }
    },
    computed: {
        totalTime(){
            let time = getTotalTime(this.prepTime, this.cookingTime);
            return this.getTimeText(time);
        }
    },
    methods: {
        getTimeText(time) {
            let text = '';
            if (time && time.h) text = `${time.h}h`;
            if(time && time.min) text += ` ${time.min}min`;

            return text;
        },
        savePrepTime(path, time) {
            if(this.recipeKey){
                this.$fire.database.ref(`recipes/${this.recipeKey}/${path}`)
                .set(time)
                .then(() => {
                    console.log(`Successfully updated ${path} time`);
                    if(path === 'prepTime') this.editPrepTime = false;
                    if(path === 'cookingTime') this.editCookingTime = false;
                    this.$emit('update');
                })
                .catch(error => console.log(`Error saving ${path} time`, error.message));
            } else {
                let timeObj = {}
                timeObj[path] = time;
                if(path === 'prepTime') this.editPrepTime = false;
                if(path === 'cookingTime') this.editCookingTime = false;
                this.$emit("update", { timeObj });
            }
        }
    }
}
</script>