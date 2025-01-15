<template>
  <div v-click-outside="closeDropdown" class="cooks_search margin-auto">
    <label>
      <userIcon class="cooks_user-icon" />
      <input
        type="text"
        :placeholder="$t('cooks.search')"
        v-model="searchTerm"
        @input="searchCooks"
      />
    </label>
    <cooks-dropdown v-if="searchTerm" :searchResult="searchResult" />
  </div>
</template>

<script>
import { getDatabase, ref, get } from "firebase/database";
import CooksDropdown from "./CooksDropdown.vue";
import userIcon from "~/assets/graphics/icons/cook-silhouette.svg";
import generatePath from "~/helpers/generatePath";

export default {
  name: "cooks-search",
  components: {
    CooksDropdown,
    userIcon
  },
  data() {
    return {
      searchTerm: "",
      open: true,
      searchResult: []
    };
  },
  methods: {
    closeDropdown() {
      this.searchTerm = "";
    },
    searchCooks() {
      let searchTerm = this.searchTerm.toLowerCase();
      const db = getDatabase();
        ref(db, "users")
        .once("value", snapshot => {
          if(snapshot.exists()){
            let users = Object.entries(snapshot.val());
            this.searchResult = users
            .filter(user => {
              let displayName = user[1].displayName.toLowerCase();
              return (!user[1].hiddenProfile && displayName.indexOf(searchTerm) > -1)
            })
            .map(user => {
              return {
                ...user[1],
                id: user[0],
                path: generatePath(user[1].displayName, user[0])
              }
            });
          }
        })

    }
  },
  
};
</script>
