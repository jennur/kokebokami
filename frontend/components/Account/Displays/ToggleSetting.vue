<template>
  <div>
    <p class="email-notifications margin-right--small">
      ...{{ setting.title }}
      <strong
        class="email-notifications__status"
        :class="{
          'color--pink': !setting.status,
          'color--blue': setting.status
        }"
      >
        {{ setting.status ? $t("on") : $t("off") }}
      </strong>
      <toggle-switch
        :checked="setting.status"
        @toggle="status => $emit('update-notification-status', !status)"
      />
    </p>
  </div>
</template>

<script>
import ToggleSwitch from "~/components/Input/ToggleSwitch.vue";

export default {
  name: "toggle-setting",
  components: {
    ToggleSwitch
  },
  props: {
    setting: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
