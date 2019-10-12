<template>
  <section class="full-width padding--xlarge">
    <form class="add-recipe-form">
      <fieldset class="flex-column">
        <label>
          Recipe title
          <input
            class="add-recipe-form__title"
            type="text"
            id="title"
            placeholder="Recipe title"
          />
        </label>
        <label>
          Recipe description
          <textarea
            class="add-recipe-form__description"
            id="description"
            placeholder="Recipe description"
          />
        </label>
      </fieldset>
      <fieldset class="flex-column">
        <input type="text" />
        <button class="button button--small">Add ingredient</button>
      </fieldset>
      <fieldset>
        <textarea
          class="add-recipe-form__instructions"
          id="instructions"
          placeholder="Recipe instructions"
        />
      </fieldset>
      <button class="button">Save recipe</button>
    </form>
  </section>
</template>

<script>
import { user } from "~/mixins/getCurrentUser.js";

export default {
  name: "add-recipe",
  components: {},
  mixins: [user],
  computed: {}
};
</script>

