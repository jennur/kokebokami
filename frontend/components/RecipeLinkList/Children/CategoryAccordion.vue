<template>
  <div class="accordion">
    <div class="accordion_tab margin-bottom-md" @click="$emit('toggle')" >
          <span class="recipe-link-list_headline margin--none">
            <downArrow v-if="open" class="icon icon-sm margin-right-md"/>
            <rightArrow v-else class="icon icon-sm margin-right-md" />
            {{ title }}
          </span>

      <button class="button--increment button--increment-small margin-left-md" @click="event => addNewLink(event)">
        Add link
      </button>
    </div>

    <expand-transition :show="open">
      <slot></slot>
    </expand-transition>

  </div>
</template>

<script>
import rightArrow from "assets/graphics/icons/right-arrow.svg";
import downArrow from "assets/graphics/icons/down-arrow.svg";
import ExpandTransition from "~/components/Transitions/Expand.vue";

export default {
  name: "category-accordion",
  components: {
    rightArrow,
    downArrow,
    ExpandTransition
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    addNewLink(event){
      event && event.stopPropagation();
      console.log("Adding new");
      this.$emit('add-link')
    }
  }
}
</script>
