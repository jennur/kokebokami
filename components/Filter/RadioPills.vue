<template>
  <div class="radio-pills">
    <label  v-for="(value, index) in values" 
            :key="`pill-${value}`" 
            class="radio-pills_pill" 
            :class="value === checkedValue ? 'selected' : ''"
            tabindex="0"
            @keydown="event => event.keyCode === 13 && setValue(value)"
    >
      <input  type="radio"
              :value="value"
              :checked="value === checkedValue"
              @click="setValue(value)"
              tabindex="-1"

      />
        {{$tm(pillsTranslationCode)[index].body.static}}
    </label>
  </div>
</template>

<script setup>
const emit = defineEmits(["selected"]);

const props = defineProps({
  pillsTranslationCode: {
    type: String,
    default: ""
  },
  values: {
    type: Array,
    default: () => []
  }
})

const checkedValue = ref(null);

function setValue(value) {
  if(checkedValue.value === value) value = null;
  checkedValue.value = value;
  emit('selected', value);
}
</script>
