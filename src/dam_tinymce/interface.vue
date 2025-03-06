<template>
  <link rel="stylesheet" type="text/css"
        href="https://scaleflex.cloudimg.io/v7/plugins/filerobot-widget/v3/latest/filerobot-widget.min.css"/>
  <div>
    <Editor
        api-key="no-api-key"
        :init="{
          plugins: 'media table lists image link pagebreak code insertdatetime autoresize preview fullscreen directionality',
          toolbar: 'h1 h2 h3 bold italic underline alignleft aligncenter alignright alignjustify bullist numlist ' +
           'outdent indent link removeformat blockquote fullscreen code sfxDAM',
          setup: (editor) => {
            editor.on('init', () => {
              const content = (value != null) ? value : '';
              editor.setContent(content);
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

            editor.on('change', () => {
              const content = editor.getContent();
              emit('input', content);
            });

            editor.on('ObjectResized', function(e) {
              if (e.target.nodeName === 'IMG') {
                let selectedImage = editor.selection.getNode();
                const currentURL = selectedImage.getAttribute('src');
                const newURL = updateUrlParams(currentURL, {w: e.width, h: e.height});
                // Set new image URL
                selectedImage.setAttribute('src', newURL);
                selectedImage.setAttribute('data-mce-src', newURL);
              }
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
import {createDirectus, rest, readMe} from '@directus/sdk';
import Editor from '@tinymce/tinymce-vue';
import './assets/style.css';

import 'tinymce/tinymce';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/skins/ui/oxide/skin.min.css';

import 'tinymce/models/dom';
import 'tinymce/plugins/code/plugin';
import 'tinymce/plugins/fullscreen/plugin';
import 'tinymce/plugins/autoresize/plugin';
import 'tinymce/plugins/directionality/plugin';
import 'tinymce/plugins/image/plugin';
import 'tinymce/plugins/insertdatetime/plugin';
import 'tinymce/plugins/link/plugin';
import 'tinymce/plugins/lists/plugin';
import 'tinymce/plugins/media/plugin';
import 'tinymce/plugins/pagebreak/plugin';
import 'tinymce/plugins/preview/plugin';
import 'tinymce/plugins/table/plugin';

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
  components: {Editor},
  data() {
    return {
      editor: null,
      content: ''
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
            const htmlRender = renderHTMLFromJSON(files);
            tinymce.get(editor_id).insertContent(htmlRender);
            let newContent = tinymce.get(editor_id).getContent();
            emit('input', newContent);
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
        let cdnLink = file.url?.cdn || "";

        if (file.url?.download !== undefined) {
          cdnLink = file.url?.download;
        }

        // Create HTML content based on the file type
        let itemContent = `<div>`;
        if (type.startsWith('image/')) {
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

    function updateUrlParams(url, params) {
      // Create URL Object
      const urlObj = new URL(url);

      // Loop all parameters
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === undefined) {
          // Remove param if value is null or undefined
          urlObj.searchParams.delete(key);
        } else {
          // Update/Add parameter
          urlObj.searchParams.set(key, value);
        }
      }
      return urlObj.toString();
    }

    return {
      closeModal,
      openModal,
      emit,
      updateUrlParams,
      isAdministrator,
      toDamSetting
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