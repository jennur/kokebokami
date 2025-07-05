<template>
  <div>
    <p class="email-notifications margin-right-sm">
      ...{{ setting.title }}
      <strong
        class="email-notifications_status"
        :class="{
          'color--pink': !setting.status,
          'color--blue': setting.status,
        }"
      >
        {{ setting.status ? $t("on") : $t("off") }}
      </strong>
      <ToggleSwitch
        :checked="setting.status"
        @toggle="(status) => emit('update-notification-status', !status)"
      />
    </p>
  </div>
</template>

<script setup>
import ToggleSwitch from "~/components/Input/ToggleSwitch.vue";
const emit = defineEmits(["update-notification-status"]);

const props = defineProps({
  setting: {
    type: Object,
    default: () => ({}),
  },
});
</script>
