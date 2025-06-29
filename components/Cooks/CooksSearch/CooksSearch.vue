<template>
  <div v-click-outside="closeDropdown" class="cooks_search margin-auto">
    <label>
      <cook-silhouette class="cooks_user-icon" />
      <input type="text" :placeholder="$t('cooks.search')" v-model="searchTerm" @input="searchCooks" />
    </label>
    <CooksDropdown v-if="searchTerm" :cooks="searchResult" />
    <ExpandTransition :show="!!errorMessage">
      <div class="system-message">{{ errorMessage }}</div>
    </ExpandTransition>
  </div>
</template>

<script setup>
import ExpandTransition from "~/components/Transitions/Expand.vue";
import CooksDropdown from "./CooksDropdown.vue";
import useAllUsers from '~/composables/allUsers';

const searchTerm = ref("");
const searchResult = ref([])
const { users, errorMessage } = await useAllUsers();

function closeDropdown() {
  searchTerm.value = "";
};

async function searchCooks() {
  searchResult.value = users
    .filter(user => {
      const displayName = user.displayName.toLowerCase();
      return (displayName.indexOf(searchTerm.value.toLowerCase()) > -1)
    })
}
</script>
