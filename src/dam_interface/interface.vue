<template>
  <SFXInterface v-model:value="internalValue"/>
</template>

<script>
import {computed} from "vue";
import SFXInterface from "./components/SFXInterface.vue";

export default {
  components: {
    SFXInterface,
  },
  props: {
    value: {
      type: String,
      default: null,
    },
  },
  emits: ['input', 'close'],
  setup(props, {emit}) {
    const internalValue = computed({
      get() {
        return props.value || '';
      },
      set(newValue) {
        emit('input', newValue);
      }
    });

    return {
      internalValue
    };
  }
};
</script>
