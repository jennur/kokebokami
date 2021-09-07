<template>
  <section class="sub-list margin-v-lg">
    <div class="flex-row flex-row--align-top flex-row--nowrap">
      <settings-dropdown class="margin-top-md" v-if="subListKey">
        <span class="system-message" @click="toggleAlert">
          <delete-icon tabindex="0" class="icon margin-right-md" />
          {{$t('shoppingLists.deleteSublist')}}
        </span>
      </settings-dropdown>
      <div class="sub-list-container">
        <sub-list-title
          :mainListKey="mainListKey"
          :subListKey="subListKey"
          :title="subList.title || this.createBackupTitle()"
          @update="$emit('update')"
          @deleteSubList="deleteSubList"
        />
        <sub-list-list-items
          :mainListKey="mainListKey"
          :subListKey="subListKey"
          :listItems="subList.listItems"
          @update="$emit('update')"
        />
      </div>
    </div>
    <Alert
      :alertMessage="
        `${$t('shoppingLists.sublistWarningText')}: '${subList.title}'?`
      "
      :showAlert="showAlert"
      @confirmed="deleteSubList"
      @cancel="toggleAlert"
    />
  </section>
</template>

<script>
import user from "~/mixins/user.js";

import SettingsDropdown from "~/components/SettingsDropdown.vue";
import SubListTitle from "./SubList/SubListTitle.vue";
import SubListListItems from "./SubList/SubListListItems.vue";
import Alert from "~/components/Alert.vue";

export default {
  name: "sub-list",
  components: {
    SettingsDropdown,
    SubListTitle,
    SubListListItems,
    Alert
  },
  props: {
    mainListTitle: String,
    mainListKey: String,
    subList: Object,
    subListKey: String
  },
  data() {
    return {
      showAlert: false
    };
  },
  mixins: [user],
  methods: {
    toggleAlert() {
      this.showAlert = !this.showAlert;
    },
    toggleEditTitle() {
      this.editTitle = !this.editTitle;
    },
    toggleEditListItems() {
      this.editListItems = !this.editListItems;
    },
    createBackupTitle() {
      let randomList1 = [
        "Surprising",
        "Glorious",
        "Magic",
        "Incredible",
        "Amusing",
        "Fantastic",
        "Fabulous",
        "Supersticious",
        "Optimistic",
        "Magnificent"
      ];
      let randomList2 = [
        "bowl",
        "plate",
        "dish",
        "skillet",
        "pot",
        "pan",
        "cup",
        "mug",
        "jar",
        "wok"
      ];
      let randomList3 = [
        "treats",
        "goodies",
        "curiosities",
        "kickshaws",
        "delectables",
        "dainties",
        "tidbits",
        "trinkets",
        "treasures",
        "novelties"
      ];
      let index1 = Math.floor(Math.random() * 10);
      let index2 = Math.floor(Math.random() * 10);
      let index3 = Math.floor(Math.random() * 10);
      return `${randomList1[index1]} ${randomList2[index2]} of ${randomList3[index3]}`;
    },
    deleteSubList() {
      let mainListKey = this.mainListKey;
      let subListKey = this.subListKey;

      this.$fire.database
        .ref(`shoppingLists/${mainListKey}/subLists/${subListKey}`)
        .remove()
        .then(() => {
          console.log("Succesfully deleted sublist");
          this.editListItems = false;
          this.toggleAlert();
          this.$emit("update");
        })
        .catch(error => console.log("Error deleting sublist:", error.message));
    }
  }
};
</script>
