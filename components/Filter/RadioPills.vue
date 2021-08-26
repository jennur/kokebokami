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
        {{pills[index]}}
    </label>
  </div>
</template>

<script>
export default {
  name: "radio-pills",
  props: {
    pills: {
      type: Array,
      default: () => []
    },
    values: {
      type: Array,
      default: () => []
    }
  },
  data(){
    return {
      checkedValue: null
    }
  },
  methods: {
    setValue(value) {
      if(this.checkedValue === value) value = null;
      this.checkedValue = value;
      this.$emit('selected', value);
    }
  }
}
</script>
