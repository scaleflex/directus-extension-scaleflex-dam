<template>
  <link rel="stylesheet" type="text/css" href="https://scaleflex.cloudimg.io/v7/plugins/filerobot-widget/v3/latest/filerobot-widget.min.css" />
	<input :value="JSON.stringify(value)" type="hidden" id="sfx_value" />
  <VButton @click="openModal" class="mb-3">Open DAM</VButton>

  <div id="sfx-result">
    <h3 class="mb-3"><strong>Asset Files</strong></h3>
    <div v-for="(item, index) in value" :key="index" class="media-container">
      <!-- Kiểm tra loại file và hiển thị phù hợp -->
      <template v-if="isImage(item.file.type)">
        <div class="sfx-item sfx-clear">
          <div class="sfx-media-icon">
            <img :src="item.link" :alt="item.file.name" class="media-item" />
          </div>
          <div class="item-info">
            <strong>Filename: </strong>{{ item.file.name }} <br>
            <strong>Type: </strong>{{ item.file.type }} <br>
            <a :href="item.link" target="_blank"><strong>View Imgage</strong></a>
          </div>
          <div class="btn-delete-item" @click="deleteItem(index)"><VIcon name="delete" /></div>
        </div>
      </template>
      <template v-else-if="isVideo(item.file.type)">
        <div class="sfx-item sfx-clear">
          <div class="sfx-media-icon">
            <div class="icon">
              <VIcon name="movie" />
            </div>
          </div>
          <div class="item-info">
            <strong>Filename: </strong>{{ item.file.name }} <br>
            <strong>Type: </strong>{{ item.file.type }} <br>
            <a :href="item.link" target="_blank"><strong>Watch Video</strong></a>
          </div>
          <div class="btn-delete-item" @click="deleteItem(index)"><VIcon name="delete" /></div>
        </div>
      </template>
      <template v-else-if="isAudio(item.file.type)">
        <div class="sfx-item sfx-clear">
          <div class="sfx-media-icon">
            <div class="icon">
              <VIcon name="volume_up" />
            </div>
          </div>
          <div class="item-info">
            <strong>Filename: </strong>{{ item.file.name }} <br>
            <strong>Type: </strong>{{ item.file.type }} <br>
            <a :href="item.link" target="_blank"><strong>Listen Audio</strong></a>
          </div>
          <div class="btn-delete-item" @click="deleteItem(index)"><VIcon name="delete" /></div>
        </div>
      </template>
      <template v-else>
        <div class="sfx-item sfx-clear">
          <div class="sfx-media-icon">
            <div class="icon">
              <VIcon name="draft" />
            </div>
          </div>
          <div class="item-info">
            <strong>Filename: </strong>{{ item.file.name }} <br>
            <strong>Type: </strong>{{ item.file.type }} <br>
            <a :href="item.link" target="_blank"><strong>View File</strong></a>
          </div>
          <div class="btn-delete-item" @click="deleteItem(index)"><VIcon name="delete" /></div>
        </div>
      </template>
    </div>
  </div>

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
    }
	},
  methods: {
    isImage(type) {
      return type.startsWith("image");
    },
    isVideo(type) {
      return type.startsWith("video");
    },
    isAudio(type) {
      return type.startsWith("audio");
    },
  },
	emits: ['input', 'close'],
	setup(props, { emit }) {
    const isOpen = ref(false);

    const api = useApi();

    const token = ref('');
    const sec = ref('');
    const directory = ref('');

		return { openSfxDAM, openModal, closeModal, deleteItem };

    function deleteItem(index) {
      let value = props.value;
      value.splice(index, 1);
      emit('input', value);
    }

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
            if (props.value !== '') {
              let newValue = props.value.concat(files);
              emit('input', newValue);
            } else {
              emit('input', files);
            }
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

.sfx-clear {
  zoom: 1;
}

.sfx-clear:after {
  clear: both;
  content: ".";
  display: block;
  height: 0;
  line-height: 0;
  visibility: hidden;
}

.sfx-media-icon {
  float: left;
}

.sfx-media-icon img {
  width: 80px;
  display: block;
  margin: 0 auto;
  height: 80px;
  object-fit: cover;
}

.sfx-item .item-info {
  margin-left: 12px;
  float: left;
}

.sfx-item .item-info a {
  color: var(--theme--primary);
}

.sfx-item {
  margin-bottom: 15px;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
  position: relative;
}

.mb-3 {
  margin-bottom: 1rem !important;
}

.sfx-media-icon .icon {
  width: 80px;
  height: 80px;
  position: relative;
}

.sfx-media-icon .icon i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(50%, 50%);
  font-size: 35px;
}

.btn-delete-item {
  position: absolute;
  top: 2px;
  right: 2px;
  color: red;
  cursor: pointer;
  padding: 2px;
}

</style>
