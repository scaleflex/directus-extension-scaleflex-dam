<template>
	<private-view title="Scaleflex DAM">
    <template #navigation>
      <div class="left-menu">
        <div v-if="isAdministrator" class="settings">
          <VIcon name="settings"/>
          <span>Scaleflex DAM</span>
        </div>
        <div @click="toDam" class="external-link">
          <VIcon name="gallery_thumbnail"/>
          <span>Assets Library</span>
        </div>
        <a href="https://docs.scaleflex.com/digital-asset-management-dam/plugins-and-connectors/plugins/directus" target="_blank" class="external-link">
          <VIcon name="description"/>
          <span>Documentation</span>
        </a>
      </div>
    </template>
    <link rel="stylesheet" type="text/css"
          href="https://scaleflex.cloudimg.io/v7/plugins/filerobot-widget/v3/latest/filerobot-widget.min.css"/>
    <div v-if="isTokenAndSecExists" class="pd-default">
      <div id="sfx-dam-widget"></div>
    </div>
    <div v-if="!isTokenAndSecExists" class="pd-default">
      <VCard class="mw-100">
        <VCardTitle class="card-title-danger">
          <VIcon name="report" />
          <span class="notice">Scaleflex DAM Notice</span>
        </VCardTitle>
        <VCardText class="card-content">
          Please visit the <span class="span-action" @click="toDamSetting">Scaleflex DAM Configuration</span>
          to add your Token and Template ID before browsing assets.
        </VCardText>
      </VCard>
    </div>
  </private-view>
</template>

<script>
import {ref, onMounted} from "vue";
import {useApi} from "@directus/extensions-sdk";
import { createDirectus, rest, readMe } from '@directus/sdk';
import './assets/style.css';

export default {
  props: {
    id: {type: Number, default: 1},
    custom: {type: Boolean, default: false},
    limit: {type: Number, default: 0},
    limitTypes: {type: String, default: null},
    attributes: {type: String, default: null},
  },
  setup(props, {emit}) {
    const api = useApi();
    const loadConfigDone = ref(false);
    const isLoading = ref(true);
    const token = ref('');
    const sec = ref('');
    const directory = ref('');
    const limit = ref(null);
    const attributes = ref([]);
    const limitType = ref([]);
    const endpoint = ref('');
    const isTokenAndSecExists = ref(false);
    const isAdministrator = ref(false);

    onMounted(() => {
      init().then(function () {
        const frConfig = {
          token: token.value,
          sec: sec.value,
          directory: directory.value,
          limitType: limitType.value,
        }
        renderWidget(frConfig);
      });
    });

    function toDamSetting(){
      const damButton = document.querySelector('a[href="/admin/scaleflex-dam-setting"]');
      if (damButton) {
        damButton.click();
      }
    }

    function toDam() {
      const damButton = document.querySelector('a[href="/admin/scaleflex-dam"]');
      if (damButton) {
        damButton.click();
      }
    }

    return {
      getIsLoading,
      toDamSetting,
      isTokenAndSecExists,
      isAdministrator,
      toDam
    };

    function getIsLoading() {
      return isLoading.value;
    }

    async function init() {
      await loadData().then(function () {
        isLoading.value = false;
        loadConfigDone.value = true;
      })

      const client = createDirectus(process.env.PUBLIC_URL).with(rest());
      const result = await client.request(readMe({
		    fields: ['role.policies.policy.admin_access'],
	    }));

      if (result?.role?.policies) {
        const policies =  result?.role?.policies
        isAdministrator.value = policies.some(item => item.policy.admin_access);
      }
    }

    async function loadData() {
      try {
        const response = await api.get(`/items/scaleflex_dam_settings/${props.id}`);
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

        if (props.custom) {
          limit.value = props.limit || null;
          limitType.value = props.limitTypes ? props.limitTypes : [];
          attributes.value = props.attributes ? props.attributes : [];
        } else {
          limit.value = data.limit || null;
          limitType.value = data.limitType ? data.limitType.split(",") : [];
          attributes.value = data.attributes ? data.attributes.split(",") : [];
        }
      } catch (error) {

      }
    }

    function renderWidget(frConfig) {
      if (!window.Filerobot) {
        return;
      }

      let Filerobot = window.Filerobot;

      let filerobot = null;

      filerobot = Filerobot.Core({
        securityTemplateID: frConfig.sec,
        container: frConfig.token
      });

      let frUploadDirectory = frConfig.directory;

      // Plugins
      let Explorer = Filerobot.Explorer;
      let XHRUpload = Filerobot.XHRUpload;

      filerobot
          .use(Explorer, {
            config: {
              rootFolderPath: frUploadDirectory
            },
            target: '#sfx-dam-widget',
            inline: true,
            width: "100%",
            height: "100%",
            disableExportButton: false,
            hideExportButtonIcon: true,
            preventExportDefaultBehavior: true,
            dismissUrlPathQueryUpdate: true,
            disableDownloadButton: true,
            hideDownloadButtonIcon: true,
            preventDownloadDefaultBehavior: true,
            locale: {
              strings: {
                mutualizedExportButtonLabel: 'Add assets',
                mutualizedDownloadButton: 'Add assets'
              }
            },
            filters: {
              mimeTypes: limitType.value, // Replace with an array of MIME types if needed
            }
          })
          .use(XHRUpload)
          .on('export', async (files, popupExportSuccessMsgFn, downloadFilesPackagedFn, downloadFileFn) => {
            // console.dir(files);
          })
          .on('complete', ({failed, uploadID, successful}) => {
            if (failed) {
              console.dir(failed);
            }

            if (successful) {
              // console.dir(successful);
              successful.forEach((item, key) => {
                // do something
              });
            }
          });
    }
  }
};
</script>