<template>
    <div class="prep-time-edit-wrapper">
        <input type="number" min="0" class="hour" v-model="newTime.h"><span>h</span>
        <input type="number" min="0" class="minutes" v-model="newTime.min"><span>min</span>
        <button class="button button-xs margin-left-md" @click="$emit('save-time', newTime)">Save</button>
    </div>
</template>

<script>
export default {
    name: "prep-time-edit",
    props: {
        time: Object
    },
    data() {
        return {
            newTime: this.newTime && JSON.parse(this.newTime) || { h: null, min: null }
        }
    }
}
</script>