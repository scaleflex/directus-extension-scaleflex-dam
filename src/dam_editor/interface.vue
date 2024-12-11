<template>
  <link rel="stylesheet" type="text/css"
        href="https://scaleflex.cloudimg.io/v7/plugins/filerobot-widget/v3/latest/filerobot-widget.min.css"/>
  <div>
    <textarea id="tinymce-editor" :value="value"></textarea>
  </div>

  <div :style="{ display: isOpen ? 'block' : 'none' }" class="modal-overlay" id="sfx-editor-modal">
    <div class="modal">
      <div class="modal-header">
        <h3>Scaleflex DAM</h3>
        <button @click="closeModal" class="modal-close-btn">×</button>
      </div>
      <div class="modal-body">
        <slot>
          <div id="sfx-dam-widget-editor"></div>
        </slot>
      </div>
      <div class="modal-footer">
        <button @click="closeModal" class="btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script>

import {onMounted, ref, toRaw} from "vue";
import {useApi} from "@directus/extensions-sdk";

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
  data() {
    return {
      editor: null,
    };
  },
  emits: ['input', 'close'],
  setup(props, {emit}) {
    const isOpen = ref(false);

    const api = useApi();
    const loadConfigDone = ref(false);
    const isLoading = ref(true);
    const token = ref('');
    const sec = ref('');
    const directory = ref('');
    const limit = ref(null);
    const attributes = ref([]);
    const limitType = ref([]);
    const isOverLimit = ref(false);
    const endpoint = ref('');
    const dialogVisible = ref(false);
    const isTokenAndSecExists = ref(false);

    onMounted(() => {
      init();
    });

    setTimeout(function () {
      tinymce.init({
        selector: '#tinymce-editor',
        plugins: [
          'media',
          'table',
          'lists',
          'image',
          'link',
          'pagebreak',
          'code',
          'insertdatetime',
          'autoresize',
          'preview',
          'fullscreen',
          'directionality',
        ],
        toolbar: "h1 h2 h3 bold italic underline alignleft aligncenter alignright alignjustify " +
            "bullist numlist outdent indent removeformat blockquote fullscreen | sfxDAM",
        setup: (editor) => {
          this.editor = editor;

          editor.ui.registry.addToggleButton('sfxDAM', {
            text: 'DAM',
            onAction: (api) => {
              console.log('open DAM');
              openModal();
            }
          });

          editor.on('input', () => {
            const content = editor.getContent();
            emit('input', content);
          });
        },
      });
    }, 1000);

    function closeModal() {
      document.getElementById("sfx-editor-modal").setAttribute("style", "display: none");
      emit('close');
      isOpen.value = false;
    }

    function openModal() {
      document.getElementById("sfx-editor-modal").setAttribute("style", "display: block");
      isOpen.value = true;
      openSfxDAM();
    }

    async function openSfxDAM() {
      const frConfig = {
        token: token.value,
        sec: sec.value,
        directory: directory.value,
        limitType: limitType.value,
      }
      renderWidget(frConfig);
    }

    async function init() {
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
            target: '#sfx-dam-widget-editor',
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
            filters: {
              mimeTypes: limitType.value, // Replace with an array of MIME types if needed
            }
          })
          .use(XHRUpload)
          .on('export', async (files, popupExportSuccessMsgFn, downloadFilesPackagedFn, downloadFileFn) => {
            console.dir(files);
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

    return {
      closeModal
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
.ml-1 {
  margin-left: 0.5rem;
}

#sfx-editor-modal .filerobot-Provider-ItemCategory-wrapper .filerobot-u-reset {
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
