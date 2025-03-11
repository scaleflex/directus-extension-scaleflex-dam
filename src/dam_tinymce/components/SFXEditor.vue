<template>
  <link rel="stylesheet" type="text/css"
        href="https://scaleflex.cloudimg.io/v7/plugins/filerobot-widget/v3/latest/filerobot-widget.min.css"/>
  <div>
    <Editor
        api-key="no-api-key"
        v-model="internalValue"
        license-key="gpl"
        :init="{
          plugins: 'media table lists image link pagebreak code insertdatetime autoresize preview fullscreen directionality',
          toolbar: 'h1 h2 h3 bold italic underline alignleft aligncenter alignright alignjustify bullist numlist ' +
           'outdent indent link removeformat blockquote fullscreen code sfxDAM',
          skin: false,
          content_css: false,
          content_style: [contentCss, contentUiCss].join('\n'),
          setup
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

import {ref, computed} from "vue";
import Editor from '@tinymce/tinymce-vue';
import '../assets/style.css';

import 'tinymce/tinymce';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';

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

import contentCss from 'tinymce/skins/content/default/content.min.css';
import contentUiCss from 'tinymce/skins/ui/oxide/content.min.css';

export default {
  props: {
    value: { type: String, default: '' },
    sec: { type: String, required: true },
    token: { type: String, required: true },
    directory: { type: String, required: true },
    limitType: { type: Array, default: () => [] }
  },
  components: {Editor},
  data() {
    return {
      editor: null,
      content: ''
    };
  },
  emits: ['update:value', 'close'],
  setup(props, {emit}) {
    const isOpen = ref(false);
    const editorRef = ref(null);

    function closeModal() {
      document.getElementById("sfx-editor-modal").setAttribute("style", "display: none");
      emit('close');
      isOpen.value = false;
    }

    function openModal(editorId) {
      document.getElementById("sfx-editor-modal").setAttribute("style", "display: block");
      isOpen.value = true;
      openSfxDAM(editorId);
    }

    async function openSfxDAM(editor_id) {
      const frConfig = {
        token: props.token,
        sec: props.sec,
        directory: props.directory,
        limitType: props.limitType,
      }
      renderWidget(frConfig, editor_id);
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
              mimeTypes: frConfig.limitType, // Replace with an array of MIME types if needed
            }
          })
          .use(XHRUpload)
          .on('export', async (files, popupExportSuccessMsgFn, downloadFilesPackagedFn, downloadFileFn) => {
            const htmlRender = renderHTMLFromJSON(files);
            tinymce.get(editor_id).insertContent(htmlRender);
            let newContent = tinymce.get(editor_id).getContent();
            emit('update:value', newContent);
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

    const internalValue = computed({
      get() {
        return props.value || '';
      },
      set(value) {
        if (props.value !== value) {
          contentUpdated();
        }
      },
    });

    let emittedValue;
    function contentUpdated() {
      const newValue = editorRef.value.getContent() ? editorRef.value.getContent() : null;

      if (newValue === emittedValue) return;

      emittedValue = newValue;
      emit('update:value', newValue);
    }

    function setup(editor) {
      editorRef.value = editor;

      editor.ui.registry.addToggleButton('sfxDAM', {
        text: 'DAM',
        onAction: (api) => {
          openModal(editor.id);
        }
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

    return {
      closeModal,
      openModal,
      emit,
      contentUiCss,
      contentCss,
      setup,
      internalValue
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