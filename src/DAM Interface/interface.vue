<template>
  <link rel="stylesheet" type="text/css" href="https://scaleflex.cloudimg.io/v7/plugins/filerobot-widget/v3/latest/filerobot-widget.min.css" />
	<input :value="JSON.stringify(value)" type="hidden" id="sfx_value" />
  <br>

  <VButton @click="openModal">Open DAM</VButton>
  <div :style="{ display: isOpen ? 'block' : 'none' }" class="modal-overlay" id="sfx-modal">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button @click="closeModal" class="modal-close-btn">×</button>
      </div>
      <div class="modal-body">
        <slot>
          <div id="sfx-dam-widget"></div>
        </slot>
      </div>
      <div class="modal-footer">
        <button @click="closeModal" class="btn">Close</button>
      </div>
    </div>
  </div>
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
    title: {
      type: String,
      default: 'Scaleflex DAM Widget',
    },
	},
	emits: ['input', 'close'],
	setup(props, { emit }) {
    const isOpen = ref(false);

    const api = useApi();

    const token = ref('');
    const sec = ref('');
    const directory = ref('');

		return { openSfxDAM, openModal, closeModal };

    function closeModal() {
      document.getElementById("sfx-modal").setAttribute("style","display: none");
      emit('close');
      isOpen.value = false;
    }

    function openModal() {
      document.getElementById("sfx-modal").setAttribute("style","display: block");
      isOpen.value = true;
      openSfxDAM();
    }

    async function openSfxDAM() {
      await loadData().then(function () {
        const frConfig = {
          token: token.value,
          sec: sec.value,
          directory: directory.value
        }
        renderWidget(frConfig);
      });
    }

    async function loadData() {
      try {
        const response = await api.get(`/items/scaleflex_dam_settings/${props.id}`);
        const data = response.data.data;

        if (!data) throw new Error('Data not found');

        token.value = data.token || '';
        sec.value = data.sec || '';
        directory.value = data.directory || '';
      } catch (error) {
        console.error(`Error loading data: ${error.message}`);
        alert('Failed to load Filerobot settings. Please check your configuration.');
      }
    }

    function renderWidget(frConfig) {
      if (!window.Filerobot) {
        console.error('Filerobot Widget is not loaded. Please check the script.');
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
            emit('input', JSON.stringify(files));
            closeModal();
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
#sfx-modal .filerobot-Provider-ItemCategory-wrapper .filerobot-u-reset {
  top: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  width: 80%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  max-height: 80vh;
  margin: 1.75rem auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  margin: 1rem 0;
}

.modal-footer {
  text-align: right;
}
</style>
