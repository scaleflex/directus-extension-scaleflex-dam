<template>
  <div>
    <SFXEditor :directory="directory" :token="token" :sec="sec" :limit-type="limitType" v-model:value="internalValue"/>
  </div>
</template>

<script>

import {computed, onMounted, ref} from "vue";
import {useApi} from "@directus/extensions-sdk";
import {createDirectus, rest, readMe} from '@directus/sdk';
import SFXEditor from "./components/SFXEditor.vue";

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {SFXEditor},
  data() {
    return {
      editor: null,
      content: ''
    };
  },
  emits: ['input', 'close'],
  setup(props, {emit}) {
    const api = useApi();
    const loadConfigDone = ref(false);
    const isLoading = ref(true);
    const token = ref('');
    const sec = ref('');
    const directory = ref('');
    const limitType = ref([]);
    const endpoint = ref('');
    const isTokenAndSecExists = ref(false);
    const isAdministrator = ref(false);

    onMounted(() => {
      init();
    });

    function toDamSetting() {
      const damButton = document.querySelector('a[href="/admin/scaleflex-dam-setting"]');
      if (damButton) {
        damButton.click();
      } else {
        window.location.href = "/admin/scaleflex-dam-setting"
      }
    }

    async function init() {

      const client = createDirectus(window.location.origin).with(rest());
      const result = await client.request(readMe({
        fields: ['role.policies.policy.admin_access'],
      }));

      if (result?.role?.policies) {
        const policies = result?.role?.policies
        const hasAdminAccess = policies.some(item => item.policy.admin_access);
        isAdministrator.value = hasAdminAccess
      }

      await loadData().then(function () {
        isLoading.value = false;
        loadConfigDone.value = true;
      })
    }

    async function loadData() {
      try {
        const response = await api.get(`/items/scaleflex_dam_settings/1`);
        const data = response.data.data;

        if (!data) throw new Error('Data not found');
        if (data.token && data.sec) {
          endpoint.value = `https://api.filerobot.com/${data.token}/v5`;
          token.value = data.token || '';
          sec.value = data.sec || '';
          directory.value = data.directory || '';
          isTokenAndSecExists.value = true;
        } else {
          isTokenAndSecExists.value = false;
        }
        limitType.value = data.limitType ? data.limitType.split(",") : [];
      } catch (error) {

      }
    }

    const internalValue = computed({
      get() {
        return props.value || '';
      },
      set(newValue) {
        emit('input', newValue);
      }
    });

    return {
      emit,
      isAdministrator,
      toDamSetting,
      internalValue,
      token,
      sec,
      directory,
      limitType
    }
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
  },
};
</script>
<style>
@import 'tinymce/skins/ui/oxide/skin.min.css';
</style>