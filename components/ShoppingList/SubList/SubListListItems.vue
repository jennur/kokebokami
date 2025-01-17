<template>
  <div>
    <ul v-if="!editMode && listItems" class="sub-list_items">
      <li
        v-for="(item, index) in listItems"
        :key="`list-item-${index}`"
        :data-list-item="`list-item-${index}`"
        class="margin-v-md"
      >
        <label
          :class="{
            complete: listItems[index].complete,
          }"
        >
          <input
            tabindex="0"
            type="checkbox"
            :checked="listItems[index].complete"
            @change="(event) => handleComplete(index)"
          />
          {{ item.text }}
        </label>
      </li>
    </ul>
    <ul v-if="editMode" class="sub-list_items">
      <li
        v-for="(listItem, index) in updatedListItems"
        :key="`edit-list-item-${index}`"
        class="margin-top-sm"
      >
        <input type="text" v-model="updatedListItems[index].text" />
        <DecrementButton @decrement="removeListItem(index)" />
      </li>
    </ul>
    <button
      v-if="!editMode"
      @click="toggleEditMode"
      class="button button-xs button--green-border button--round"
      tabindex="0"
    >
      {{ $t("editList") }}
      <edit-icon class="icon margin-left-sm" />
    </button>

    <div v-if="editMode" class="flex-row flex-row--align-center">
      <IncrementButton
        class="margin-right-md margin-v-lg"
        @increment="addNewListItem"
        >{{ $t("addItem") }}</IncrementButton
      >
      <button
        v-if="listItems.length"
        class="button button-xs button--round padding-h-lg margin-v-lg"
        @click="saveListItems"
      >
        {{ $t("save") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { getDatabase, ref, get } from "firebase/database";
import IncrementButton from "~/components/Input/IncrementButton.vue";
import DecrementButton from "~/components/Input/DecrementButton.vue";

const emit = defineEmits(["update"]);
const props = defineProps({
  mainListKey: {
    type: String,
    default: "",
  },
  subListKey: {
    type: String,
    default: "",
  },
  listItems: {
    type: Array,
    default: () => [],
  },
});

const editMode = ref(!props.listItems.length);
const updatedListItems = ref(props.listItems || []);

watch(listItems, (value) => {
  props.updatedListItems = value;
});

function toggleEditMode() {
  editMode.value = !editMode.value;
}

function addNewListItem() {
  updatedListItems.value.push({ text: "", complete: false });
}

function removeListItem(index) {
  updatedListItems.value.splice(index, 1);
}

function handleComplete(index) {
  let complete = updatedListItems.value[index].complete;
  updatedListItems.value[index].complete = !complete;
  saveListItems();
}

function saveListItems() {
  const mainListKey = props.mainListKey;
  const listItems = updatedListItems.value;
  const subListKey = props.subListKey;

  const db = getDatabase();
  const mainListRef = ref(db, `shoppingLists/${mainListKey}`);

  if (mainListKey && subListKey !== "") {
    update(child(child(mainListRef, "subLists"), subListKey), { listItems })
      .then(() => {
        //console.log("Sublist successfully updated");
        editMode.value = false;
        emit("update");
      })
      .catch((error) =>
        console.error(
          "[saveListItems] Failed to update sublist:",
          error.message
        )
      );
  } else if (mainListKey && subListKey === "") {
    console.info("[saveListItems] Adding new sublist");
    push(child(mainListRef, "subLists"), { listItems })
      .then(() => {
        console.info("[saveListItems] Successfully added new sublist");
        editMode.value = false;
        emit("update");
      })
      .catch((error) =>
        console.error("[saveListItems] Failed to add sublist:", error.message)
      );
  } else {
    console.error(
      "[saveListItems] Something went wrong while trying to add/update sublist"
    );
  }
}
</script>
