<template>
  <div class="radio-pills-wrap">
    <div class="radio-pills">
      <span v-for="(value, index) in values" :key="`pill-${value}`" class="radio-pills_pill" :class="value === checkedValue ? 'selected' : ''">
        <label>
          <input type="radio" :value="value" :checked="value === checkedValue" @click="setValue(value)"/>
            {{pills[index]}}
        </label>
      </span>
    </div>
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
