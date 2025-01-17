<template>
  <section class="sub-list margin-v-lg">
    <div class="flex-row flex-row--align-top flex-row--nowrap">
      <settings-dropdown class="margin-top-md margin-right-md" v-if="subListKey">
        <span class="system-message" @click="toggleAlert">
          <delete-icon tabindex="0" class="icon margin-right-md" />
          {{ $t('shoppingLists.deleteSublist') }}
        </span>
      </settings-dropdown>
      <div class="sub-list-container">
        <sub-list-title :mainListKey="mainListKey" :subListKey="subListKey"
          :title="subList.title || createBackupTitle()" @update="$emit('update')" @deleteSubList="deleteSubList" />
        <sub-list-list-items :mainListKey="mainListKey" :subListKey="subListKey" :listItems="subList.listItems"
          @update="$emit('update')" />
      </div>
    </div>
    <Alert :alertMessage="`${$t('shoppingLists.sublistWarningText')}: '${subList.title}'?`
      " :showAlert="showAlert" @confirmed="deleteSubList" @cancel="toggleAlert" />
  </section>
</template>

<script setup>
import { getDatabase, ref, get } from "firebase/database";
import { randomWords } from "~/helpers/shopping-list-random-words";

import SettingsDropdown from "~/components/SettingsDropdown.vue";
import SubListTitle from "./SubList/SubListTitle.vue";
import SubListListItems from "./SubList/SubListListItems.vue";
import Alert from "~/components/Alert.vue";

const emit = defineEmits(["update"]);

const props = defineProps({
  mainListTitle: String,
  mainListKey: String,
  subList: Object,
  subListKey: String
});
const showAlert = ref(false);


function toggleAlert() {
  showAlert.value = !showAlert.value;
}

function createBackupTitle() {
  const { group1, group2, group3 } = randomWords;
  const index1 = Math.floor(Math.random() * 10);
  const index2 = Math.floor(Math.random() * 10);
  const index3 = Math.floor(Math.random() * 10);
  return `${group1[index1]} ${group2[index2]} of ${group3[index3]}`;
}

function deleteSubList() {
  const db = getDatabase();
  remove(ref(db, `shoppingLists/${props.mainListKey}/subLists/${props.subListKey}`))
    .then(() => {
      console.info("[deleteSubList] Succesfully deleted sublist");
      editListItems.value = false;
      toggleAlert();
      emit("update");
    })
    .catch(error => console.error("[deleteSubList]", error.message));
}
</script>
