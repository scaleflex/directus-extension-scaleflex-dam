<template>
	<private-view title="Scaleflex DAM">
    <template #navigation>
      <div style="margin-top: 20px; padding: 0 10px">
        <div style="display: flex; flex-direction: column; align-content: center">
          <div @click="toDamSetting" class="external-link">
            <VIcon name="settings" style="color: var(--theme--primary)" />
            <span style="margin-left: 4px; font-size: 14px;  display: block">Scaleflex DAM</span>
          </div>
          <div style="display: flex; align-items: center; background: var(--theme--navigation--project--background); padding: 5px 8px; border-radius: 4px; margin-top: 8px;">
            <VIcon name="gallery_thumbnail" style="color: var(--theme--primary)"/>
            <span style="margin-left: 4px; font-size: 14px;  display: block">Assets Library</span>
          </div>
          <a href="https://docs.scaleflex.com/digital-asset-management-dam/plugins-and-connectors/plugins/directus" target="_blank" class="external-link" style="margin-top: 8px;">
            <VIcon name="description" style="color: var(--theme--primary)" />
            <span style="margin-left: 4px; font-size: 14px;  display: block">Documentation</span>
          </a>
        </div>
      </div>
    </template>
    <link rel="stylesheet" type="text/css"
          href="https://scaleflex.cloudimg.io/v7/plugins/filerobot-widget/v3/latest/filerobot-widget.min.css"/>
    <div v-if="isTokenAndSecExists" style="margin: 32px">
      <div id="sfx-dam-widget"></div>
    </div>
    <div v-if="!isTokenAndSecExists" style="padding: 32px">
      <VCard style="max-width: 100%;">
        <VCardTitle style="color: tomato; display: flex; align-items: center;">
          <VIcon name="report" />
          <span style="font-size: 14px; margin-left: 5px">Scaleflex DAM Notice</span>
        </VCardTitle>
        <VCardText style="max-width: 100%; padding-bottom: 25px">
          Please visit the <span style="text-decoration: underline; color: dodgerblue; cursor: pointer" @click="toDamSetting" target="_blank">Scaleflex DAM Configuration</span>
          to add your Token and Template ID before browsing assets.
        </VCardText>
      </VCard>
    </div>
  </private-view>
</template>

<script>
import {ref, onMounted} from "vue";
import {useApi} from "@directus/extensions-sdk";

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

    return {
      getIsLoading,
      toDamSetting,
      isTokenAndSecExists
    };

    function getIsLoading() {
      return isLoading.value;
    }

    async function init() {
      await loadData().then(function () {
        isLoading.value = false;
        loadConfigDone.value = true;
      })
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
            console.dir(files);
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

<style>
#sfx-dam-widget .filerobot-Provider-ItemCategory-wrapper .filerobot-u-reset {
  top: 0;
}

.header-bar {
  z-index: 99999;
}

.filerobot-common-Search-searchInput {
  background: #FFF;
}

.external-link{
  display: flex;
  padding: 5px 8px;
  border-radius: 4px;
  transition: background 500ms ease;
  align-items: center;
}

.external-link:hover{
  background: var(--theme--navigation--project--background);
}
</style>
