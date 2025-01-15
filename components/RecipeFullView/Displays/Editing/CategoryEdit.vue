<template>
  <div class="flex-row flex-align--center" v-click-outside="saveTypes">
    <span
      class="category-edit"
      v-for="type in convertedTypes"
      :key="type.text"
      :class="{ selected: type.checked, orange }"
      @click="selectType(type.text)"
    >
      {{ type.text }}
    </span>
  </div>
</template>

<script>
 

export default {
  name: "category-edit",
  props: {
    existingTypes: {
      type: Array,
      default: () => []
    },
    allTypes: {
      type: Array,
      default: () => []
    },
    orange: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedTypes: this.existingTypes
    };
  },
  computed: {
    convertedTypes() {
      return this.allTypes.map(type => {
        let checked = false;
        if (this.selectedTypes.indexOf(type) > -1) checked = true;
        return {
          text: type,
          checked
        };
      });
    }
  },
  methods: {
    selectType(type) {
      let indexOfType = this.selectedTypes.indexOf(type);
      if (indexOfType > -1) {
        this.selectedTypes.splice(indexOfType, 1);
      } else {
        this.selectedTypes.push(type);
      }
    },
    saveTypes() {
      this.$emit("save", this.selectedTypes);
    }
  },
  
};
</script>
