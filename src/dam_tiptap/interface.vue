<template>
  <div v-if="editor" class="container">
    <link rel="stylesheet" type="text/css"
          href="https://scaleflex.cloudimg.io/v7/plugins/filerobot-widget/v3/latest/filerobot-widget.min.css"/>
    <div class="control-group" style="padding: 20px 0">
      <div class="button-group">
        <VButton
            @click="openModal"
        >
          <VIcon name="image"/>
          <span style="margin-left: 5px">Browse assets</span>
        </VButton>
      </div>
    </div>
    <input type="hidden" :value="value" id="sfx_tiptap_value">
    <editor-content :editor="editor" />
  </div>

  <div :style="{ display: isOpen ? 'block' : 'none' }" class="modal-overlay" id="sfx-tiptap-modal">
    <div class="modal">
      <div class="modal-header">
        <h3>Scaleflex DAM</h3>
        <button @click="closeModal" class="modal-close-btn">×</button>
      </div>
      <div class="modal-body">
        <slot>
          <div id="sfx-dam-widget-tiptap-editor"></div>
        </slot>
      </div>
      <div class="modal-footer">
        <button @click="closeModal" class="btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import {useApi} from "@directus/extensions-sdk";

export default {
  components: {
    EditorContent,
  },
  props: {
    value: {
      type: String,
      default: null,
    },
    custom: {type: Boolean, default: false},
    limit: {type: Number, default: 0},
    limitTypes: {type: String, default: null},
    attributes: {type: String, default: null},
    config: {type: Object, default: null},
  },
  methods: {
    addImage(url) {
      this.editor.chain().focus().setImage({ src: url }).run()
    },
  },
  emits: ['input', 'close'],
  setup(props, {emit}) {
    const editor = ref(null);
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

      editor.value = new Editor({
        extensions: [
          StarterKit,
          Image.configure({
            inline: true,
          }),
        ],
      });
    });

    onBeforeUnmount(() => {
      editor.value.destroy();
    });

    function openModal() {
      document.getElementById("sfx-tiptap-modal").setAttribute("style", "display: block");
      isOpen.value = true;
      openSfxDAM();
    }

    function closeModal() {
      document.getElementById("sfx-tiptap-modal").setAttribute("style", "display: none");
      emit('close');
      isOpen.value = false;
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
            target: '#sfx-dam-widget-tiptap-editor',
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
            files.forEach(item => {
              editor.value.chain().focus().setImage({ src: item.file.url.cdn }).run();
            });
            emit('input', editor.value.getHTML());
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
      editor,
      openModal,
      closeModal,
      isOpen
    };
  },
};
</script>

<style>
#sfx-tiptap-modal .filerobot-Provider-ItemCategory-wrapper .filerobot-u-reset {
  top: 0;
}
</style>
