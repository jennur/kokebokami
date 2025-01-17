<template>
  <ModalBox :open="open" :dark-bg="false" @close="$emit('close-modal')">
    <h4>
      {{
        `${$t("share")} '${listTitle}' ${$t(
          "shoppingLists.share.withFollower"
        )}`
      }}
    </h4>

    <form class="share-form" v-on:submit.prevent>
      <fieldset
        class="flex-row flex-row--align-center flex-row--nowrap margin-bottom-md"
      >
        <label class="share-form_followers">
          <SelectComponent
            class="share-form_select margin-right-xl"
            :options="followerNames"
            defaultValue="Select a user"
            @select="(option) => (selected = option)"
          />
        </label>

        <HoverInfoBox class="margin-left-sm margin-bottom-sm">
          {{ $t("shoppingLists.share.shareWithFollowerNote") }}
        </HoverInfoBox>
      </fieldset>

      <button @click="shareShoppingList" class="button button-sm margin-top-md">
        {{ $t("share") }}
      </button>
    </form>

    <ExpandTransition :show="!!systemMessage">
      <div class="system-message margin-top-lg">
        {{ systemMessage }}
      </div>
    </ExpandTransition>
  </ModalBox>
</template>

<script setup>
import { getDatabase, ref, get } from "firebase/database";
import ExpandTransition from "~/components/Transitions/Expand.vue";
import SelectComponent from "~/components/Input/SelectComponent.vue";
import HoverInfoBox from "~/components/HoverInfoBox";
import ModalBox from "~/components/ModalBox";

import { useAuthStore, useShoppingListStore } from "~/store";

const db = getDatabase();
const authStore = useAuthStore();
const shoppingListStore = useShoppingListStore();

const searchTerm = ref("");
const selected = ref("");
const shareByEmail = ref(false);
const email = ref("");
const systemMessage = ref("");

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  listKey: {
    type: String,
    default: "",
  },
  listTitle: {
    type: String,
    default: "",
  },
});

const followerNames = computed(
  () =>
    authStore.followers &&
    authStore.followers.map((follower) => follower.displayName)
);

const selectedFollower = computed(
  () =>
    authStore.followers.filter(
      (follower) => follower.displayName === selected.value
    )[0]
);

function shareShoppingList() {
  const follower = selectedFollower.value;
  const shoppingList = shoppingListStore.shoppingLists.filter(
    (list) => list.key === props.listKey
  );

  if (follower.id && shoppingList) {
    const owners = shoppingList.owners;
    let shared = false;

    owners.forEach((owner) => {
      if (owner.id === follower.id) {
        systemMessage.value = `This shopping list is already shared with ${follower.displayName} `;
        shared = true;
      }
    });

    if (!shared) {
      try {
        push(ref(db, `shoppingLists/${props.listKey}/owners`), {
          id: follower.id,
          displayName: follower.displayName,
          sharedFrom: {
            id: authStore.user.id,
            displayName: authStore.user.displayName,
          },
        }).then(() => {
          systemMessage.value = `Successfully shared with ${follower.displayName}`;
          shoppingListStore.REFRESH();
          emit("update");
          if (
            !follower.notificationsOff ||
            !follower.notificationsOff.shoppingLists
          ) {
            emit("shared", follower);
          }
        });
      } catch (error) {
        console.error("[shareShoppingList]", error.message);
        systemMessage.value = "An error occured while sharing";
      }
    }
  } else {
    systemMessage.value = "We were unable to find this user in the database";
  }
}
</script>
