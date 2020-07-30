<template>
  <span @click="togglePublic" :key="updated">
    Make recipe {{ isPublic ? "private" : "public" }}
  </span>
</template>
<script>
export default {
  name: "public-note",
  props: {
    isPublic: {
      type: Boolean,
      default: false
    },
    recipeKey: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      updated: 1
    };
  },
  methods: {
    togglePublic() {
      let isPublic = !this.isPublic;
      let recipeKey = this.recipeKey;

      if (recipeKey) {
        let publicRef = this.$fireDb.ref(`recipes/${recipeKey}/public`);
        publicRef
          .set(isPublic)
          .then(() => {
            console.log("Successfully updated public status");
            this.$emit("update");
            this.updated++;
          })
          .catch(error =>
            console.log("Error updating public status:", error.message)
          );
      } else {
        this.$emit("update", { public: isPublic });
        this.updated++;
      }
    }
  }
};
</script>
