<template>
  <link rel="stylesheet" type="text/css" href="https://scaleflex.cloudimg.io/v7/plugins/filerobot-widget/v3/latest/filerobot-widget.min.css" />
	<input :value="value" type="hidden" id="thumbnail" @input="handleChange($event.target.value)" />
  <br>
  <VButton @click="openSfxDAM()">
    Open Scaleflex DAM
  </VButton>
  <div id="sfx-dam-widget"></div>
</template>

<script>
import {ref} from "vue";
import {useApi} from "@directus/extensions-sdk";

export default {
	props: {
		value: {
			type: String,
			default: null,
		},
    collection: { type: String, default: 'scaleflex_dam_settings' },
    id: { type: Number, default: 1 },
	},

	emits: ['input'],
	setup(props, { emit }) {
    const api = useApi();

    const token = ref('');
    const sec = ref('');
    const directory = ref('');

    loadData();

		return { handleChange, openSfxDAM };

		function handleChange(value) {
			emit('input', value);
		}

    async function openSfxDAM() {
      let Filerobot = window.Filerobot;

      let filerobot = null;

      filerobot = Filerobot.Core({
        securityTemplateID: sec,
        container: token
      });
      const frConfig = {
        token: token,
        sec: sec,
        directory: directory
      }
      await renderWidget(filerobot, frConfig);
      console.log('Open');
    }

    async function loadData() {
      try {
        const response = await api.get(`/items/${props.collection}/${props.id}`);
        const data = response.data.data;
        token.value = data.token || '';
        sec.value = data.sec || '';
        directory.value = data.directory || '';
      } catch (error) {
        console.error(`Error loading data: ${error.message}`);
      }
    }

    async function waitFilerobotLibrary() {
      return new Promise(function (resolve, reject) {
        let check = false;
        while (!check) {
          if (window.Filerobot !== undefined) {
            check = true;
            resolve(true);
          }
        }
      });
    }

    function renderWidget(filerobot, frConfig) {
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
            disableDownloadButton: false,
            hideDownloadButtonIcon: true,
            preventDownloadDefaultBehavior: true,
            locale: {
              strings: {
                mutualizedExportButtonLabel: 'Add assets',
                mutualizedDownloadButton: 'Add assets'
              }
            },
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
