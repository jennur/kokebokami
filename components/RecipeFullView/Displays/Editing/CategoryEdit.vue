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

<script setup>
const emit = defineEmits(["save"]);

const props = defineProps({
  existingTypes: {
    type: Array,
    default: () => [],
  },
  allTypes: {
    type: Array,
    default: () => [],
  },
  orange: {
    type: Boolean,
    default: false,
  },
});

const selectedTypes = ref(props.existingTypes);

const convertedTypes = computed(() =>
  props.allTypes.map((type) => {
    let checked = false;
    if (selectedTypes.value.indexOf(type) > -1) checked = true;
    return {
      text: type,
      checked,
    };
  })
);

function selectType(type) {
  const indexOfType = selectedTypes.value.indexOf(type);
  if (indexOfType > -1) {
    selectedTypes.value.splice(indexOfType, 1);
  } else {
    selectedTypes.value.push(type);
  }
}

function saveTypes() {
  emit("save", selectedTypes.value);
}
</script>
