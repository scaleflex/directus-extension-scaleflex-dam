<template>
  <link rel="stylesheet" type="text/css"
        href="https://scaleflex.cloudimg.io/v7/plugins/filerobot-widget/v3/latest/filerobot-widget.min.css"/>
  <div>
    <Editor
        api-key="qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc"
        :init="{
          plugins: 'media table lists image link pagebreak code insertdatetime autoresize preview fullscreen directionality',
          toolbar: 'h1 h2 h3 bold italic underline alignleft aligncenter alignright alignjustify bullist numlist ' +
           'outdent indent link removeformat blockquote fullscreen code | sfxDAM',
          setup: (editor) => {
            editor.on('init', () => {
              editor.setContent(value);
            });

            editor.ui.registry.addToggleButton('sfxDAM', {
              text: 'DAM',
              onAction: (api) => {
                openModal(editor.id);
              }
            });

            editor.on('input', () => {
              const content = editor.getContent();
              emit('input', content);
            });
          }
        }"
    />
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

import {onMounted, ref} from "vue";
import {useApi} from "@directus/extensions-sdk";
import Editor from '@tinymce/tinymce-vue'

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
  components: { Editor },
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
    const endpoint = ref('');
    const isTokenAndSecExists = ref(false);

    onMounted(() => {
      init();
    });

    function closeModal() {
      document.getElementById("sfx-editor-modal").setAttribute("style", "display: none");
      emit('close');
      isOpen.value = false;
    }

    function openModal(id) {
      document.getElementById("sfx-editor-modal").setAttribute("style", "display: block");
      isOpen.value = true;
      openSfxDAM(id);
    }

    async function openSfxDAM(editor_id) {
      const frConfig = {
        token: token.value,
        sec: sec.value,
        directory: directory.value,
        limitType: limitType.value,
      }
      renderWidget(frConfig, editor_id);
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

    function isImage(type) {
      return type.startsWith("image");
    }

    function isVideo(type) {
      return type.startsWith("video");
    }

    function isAudio(type) {
      return type.startsWith("audio");
    }


    function renderWidget(frConfig, editor_id) {
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
            const htmlRender = renderHTMLFromJSON(files);
            tinymce.get(editor_id).insertContent(htmlRender)
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

    // Function to render HTML from JSON data
    function renderHTMLFromJSON(data) {
      let result = "";

      data.forEach(item => {
        // Extract necessary properties from the JSON structure
        const file = item.file;
        const type = file.type;
        const title = file.meta?.title?.en || "No Title";
        const cdnLink = file.url?.cdn || "";

        if (file.url?.download !== undefined) {
          cdnLink.value = file.url?.download;
        }

        // Create HTML content based on the file type
        let itemContent = `<div>`;
        if (type === 'image/jpeg' || type === 'image/png') {
          itemContent += `<img src='${cdnLink}' alt='${title}' />`;
        } else if (type === 'video/mp4' || type.startsWith('video/')) {
          itemContent += `<video src='${cdnLink}' controls></video>`;
        } else if (type === 'audio/mpeg' || type.startsWith('audio/')) {
          itemContent += `<audio src='${cdnLink}' controls></audio>`;
        }
        itemContent += `</div>`;

        // Append to result string
        result += itemContent;
      });

      // Return the result string
      return result;
    }

    return {
      closeModal,
      openModal,
      emit,
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
