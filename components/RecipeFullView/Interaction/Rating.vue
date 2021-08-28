<template>
    <section class="rating-wrapper">
        <fa v-for="index in totalRating"
            :key="`star-${index}`"
            :data-star="`star-${index}`"
            tabindex="0"
            :icon="['fas', 'star']"
            style="font-size:15px;margin-right:5px;cursor:pointer;"
            @click="!deactivated && setRating(index)"
            @keydown="event => event.keyCode === 13 && !deactivated && setRating(index)"
        />
        <fa v-for="index in (5 - totalRating)"
            :key="`star-${index + totalRating}`"
            :data-star="`star-${index + totalRating}`"
            tabindex="0"
            :icon="['far', 'star']"
            style="font-size:15px;margin-right:5px;cursor:pointer;"
            @click="!deactivated && setRating(index + totalRating)"
            @keydown="event => event.keyCode === 13 && !deactivated && setRating(index + totalRating)"
        />
        <span v-if="showTotalVotes" class="total-votes"> ({{ totalVoted }})</span>
    </section>
</template>

<script>

export default {
    name: "rating",
    props: {
        rating: Array,
        recipeKey: String,
        showTotalVotes: Boolean,
        deactivated: Boolean
    },
    data() {
        return {
            currentRating: this.rating || []
        }
    },
    computed: {
        totalRating() {
            if(this.currentRating.length) {
                let rateCount = this.currentRating.reduce((a, b) => a + b, 0);
                return rateCount && Math.round(rateCount/this.currentRating.length) || 0
            }
            return 0;
        },
        totalVoted() {
            return this.currentRating.length;
        }
    },
    methods: {
        setRating(rate) {
            if (this.recipeKey) {
                let newRating = [rate];
                let rateRef = this.$fire.database.ref(`recipes/${this.recipeKey}/rating`);

                rateRef.once('value', snapshot => {
                    if(snapshot.val()) {
                        let rating = snapshot.val();
                        newRating = rating.concat([rate]);
                    }

                    rateRef.set(newRating)
                    .then(() => {
                        this.currentRating.push(rate);
                        console.log(`Rated ${rate} stars!`);
                    }).catch(error =>
                        console.log("Error setting rate:", error.message)
                    );
                })
                .catch(error =>
                    console.log("Error reading rate:", error.message)
                );
            }
        }
    }
}
</script>
