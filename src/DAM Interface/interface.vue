<template>
  <link rel="stylesheet" type="text/css" href="https://scaleflex.cloudimg.io/v7/plugins/filerobot-widget/v3/latest/filerobot-widget.min.css" />
	<input :value="JSON.stringify(value)" type="hidden" id="sfx_value" />

  <div id="sfx-result">
    <div class="remove-all" v-if="getTotalAssets() > 0">
      <span @click="removeAllAssets()">
        Remove all assets
      </span>
    </div>

    <draggable class="asset-content" :list="value" @change="log">
      <div v-for="(item, index) in value" :key="index" class="media-container">
        <!-- Kiểm tra loại file và hiển thị phù hợp -->
        <template v-if="isImage(item.type)">
          <div class="sfx-item sfx-clear">
            <div class="sfx-media-icon">
              <img :src="createThumbnail(item.cdn)" :alt="item.name" class="media-item" />
            </div>
            <div class="item-info">
              <strong>Filename: </strong>{{ item.name }} <br>
              <strong>Type: </strong>{{ item.type }} <br>
              <a :href="item.cdn" target="_blank"><strong>View Imgage</strong></a>
            </div>
            <div class="btn-delete-item" @click="deleteItem(index)"><VIcon name="delete" /></div>
<div class="btn-drag-item" @click="deleteItem(index)"><VIcon name="drag_indicator" /></div>
          </div>
        </template>
        <template v-else-if="isVideo(item.type)">
          <div class="sfx-item sfx-clear">
            <div class="sfx-media-icon">
              <div class="icon">
                <VIcon name="movie" />
              </div>
            </div>
            <div class="item-info">
              <strong>Filename: </strong>{{ item.name }} <br>
              <strong>Type: </strong>{{ item.type }} <br>
              <a :href="item.cdn" target="_blank"><strong>Watch Video</strong></a>
            </div>
            <div class="btn-delete-item" @click="deleteItem(index)"><VIcon name="delete" /></div>
<div class="btn-drag-item" @click="deleteItem(index)"><VIcon name="drag_indicator" /></div>
          </div>
        </template>
        <template v-else-if="isAudio(item.type)">
          <div class="sfx-item sfx-clear">
            <div class="sfx-media-icon">
              <div class="icon">
                <VIcon name="volume_up" />
              </div>
            </div>
            <div class="item-info">
              <strong>Filename: </strong>{{ item.name }} <br>
              <strong>Type: </strong>{{ item.type }} <br>
              <a :href="item.cdn" target="_blank"><strong>Listen Audio</strong></a>
            </div>
            <div class="btn-delete-item" @click="deleteItem(index)"><VIcon name="delete" /></div>
<div class="btn-drag-item" @click="deleteItem(index)"><VIcon name="drag_indicator" /></div>
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
              <strong>Filename: </strong>{{ item.name }} <br>
              <strong>Type: </strong>{{ item.type }} <br>
              <a :href="item.cdn" target="_blank"><strong>View File</strong></a>
            </div>
            <div class="btn-delete-item" @click="deleteItem(index)"><VIcon name="delete" /></div>
<div class="btn-drag-item" @click="deleteItem(index)"><VIcon name="drag_indicator" /></div>
          </div>
        </template>
      </div>
    </draggable>

    <div class="flex">    
      <div v-if="getTotalAssets() > 0" class="column align-left text-small-size">
        <span>Total: {{getTotalAssets()}}</span>
        <span v-if="limitFiles() > 0"> / Limit: {{limitFiles()}}</span>
      </div>
        
      <div v-if="getIsOverLimit()" class="column exceeds-the-limit">
        <svg xmlns="http://www.w3.org/2000/svg" fill="red" version="1.1"  width="12px" height="12px" viewBox="0 0 478.125 478.125">
          <g>
            <g>
              <g>
                <circle cx="239.904" cy="314.721" r="35.878"/>
                <path d="M256.657,127.525h-31.9c-10.557,0-19.125,8.645-19.125,19.125v101.975c0,10.48,8.645,19.125,19.125,19.125h31.9     c10.48,0,19.125-8.645,19.125-19.125V146.65C275.782,136.17,267.138,127.525,256.657,127.525z"/>
                <path d="M239.062,0C106.947,0,0,106.947,0,239.062s106.947,239.062,239.062,239.062c132.115,0,239.062-106.947,239.062-239.062     S371.178,0,239.062,0z M239.292,409.734c-94.171,0-170.595-76.348-170.595-170.596c0-94.248,76.347-170.595,170.595-170.595     s170.595,76.347,170.595,170.595C409.887,333.387,333.464,409.734,239.292,409.734z"/>
              </g>
            </g>
          </g>
        </svg>
        <span class="ml-1">Exceeded maximum number of assets</span>
      </div> 
    </div>
  </div>

  <div class="flex flex-justify-content-end">
    <VButton
      @click="openModal"
      :disabled="addAssetsDisabled()"
      :xSmall="true"
    >
      Add Assets
    </VButton>
    
    <VButton
        type="button"
        @click="refreshAssets()"
        :disabled="getTotalAssets() === 0"
        :loading="getIsLoading()"
        :xSmall="true"
        :outlined="true"
      >
      Refresh Assets
    </VButton>
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
import { ref, onMounted, toRaw, isProxy } from "vue";
import {useApi} from "@directus/extensions-sdk";
import { VueDraggableNext } from "vue-draggable-next";

export default {
  components: {
    draggable: VueDraggableNext,
  },
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
    hasQueryString (url) {
      try {
        const urlObject = new URL(url);
        return urlObject.search.length > 0;
      } catch (error) {
        return false;
      }
    },
    createThumbnail(url) {
      if (!this.hasQueryString(url)) return url + '?width=80&height=80'
      else return url + '&width=80&height=80'
    }
  },
	emits: ['input', 'close'],
	setup(props, { emit }) {
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

    onMounted(() => {
      init();
    });

		return { 
      openSfxDAM,
      openModal,
      closeModal,
      deleteItem,
      limitFiles,
      getIsOverLimit,
      getTotalAssets,
      addAssetsDisabled,
      refreshAssets,
      getIsLoading,
      removeAllAssets,
      log
    };

    function log () {    
      emit('input', toRaw(props.value));
    }

    function addAssetsDisabled () {
      if (limit.value == getTotalAssets() && getTotalAssets() > 0) return true;
      return isLoading.value;
    }

    function getIsLoading() {
      return isLoading.value;
    }

    function deleteItem(index) {
      let value = props.value;
      value.splice(index, 1);
      checkLimit(value)
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
        const response = await api.get(`/items/scaleflex_dam_settings/${props.id}`);
        const data = response.data.data;

        if (!data) throw new Error('Data not found');
        endpoint.value = `https://api.filerobot.com/${data.token}/v5`;
        token.value = data.token || '';
        sec.value = data.sec || '';
        directory.value = data.directory || '';
        limit.value = data.limit || null;
        limitType.value = data.limitType ? data.limitType.split(",") : [];
        attributes.value = data.attributes ? data.attributes.split(",") : [];
      } catch (error) {
        console.error(`Error loading data: ${error.message}`);
        alert('Failed to load Filerobot settings. Please check your configuration.');
      }
    }

    function getAttributesData (file) {
      let r = {};
      if (attributes.value.length > 0 ) {
        let arr = attributes.value
        for (let value of arr) {
          let valueTrim = value.trim();
          r[valueTrim] = file[valueTrim]
        }
        return r
      }
    }

    function checkLimit (updatedFiles) {
      if (limitFiles() > 0 && updatedFiles.length > limitFiles()) {
        isOverLimit.value = true
      } else {
        isOverLimit.value = false
      }
    }

    function getTypeAssets (type) {
      let arr = type.split("/");
      return arr[0]
    }

    function getFilesByLimitType (updatedFiles, limitType) {
      const limitTypeArr = limitType;
      if (limitTypeArr.includes('document')) return updatedFiles.filter((file) => limitTypeArr.includes(getTypeAssets(file.type)) || !['image', 'video', 'audio'].includes(getTypeAssets(file.type)))
      else return updatedFiles.filter((file) => limitTypeArr.includes(getTypeAssets(file.type)))
    }

    function getFileUuid(file) {
      const uuidArray = file.uuid.split("_");
      return uuidArray[0];
    }

    async function updatFiles (updatedFiles, isRefresh = false) {
      isLoading.value = true;
     
      const fetchPromises = updatedFiles.map(async (file, index) => {
          try {
            
            // Call fetchfileData for each file's uuid (assuming file has a 'uuid' property)
            let uuid = '';
            if (isRefresh) uuid = getFileUuid(file)
            else uuid = file.file.uuid;

            const response = await fetchfileData(uuid);
            const tempFile = {
              uuid: response?.file?.uuid + '_' + makeIndexFiles(index),
              name: response?.file?.name,
              cdn: removeURLParameter(response?.file?.url?.cdn, 'vh'),
              extension: response?.file?.extension,
              source: 'filerobot',
              type: response?.file?.type,
              ownerName: response?.file?.owner?.name,
            };

            if (attributes.value.length > 0 ) {
              tempFile.attributes = getAttributesData(response?.file);
            }

            return tempFile; // Return the data for each file
          } catch (err) {
            return null; // Return null in case of error for this file
          }
      });

      // Wait for all fetch operations to complete and collect all results
      try {
        const results = await Promise.all(fetchPromises);
       
        const tempFiles = results.filter(file => file);
        let updatedFiles = null;
       
        if (isRefresh || !props.value) updatedFiles = [...tempFiles];
        else updatedFiles = [...props.value, ...tempFiles];
        
        
        
        checkLimit(updatedFiles)

        if (limitFiles() > 0) updatedFiles = updatedFiles.slice(0, limitFiles())

        if (limitType.value.length > 0 ) {
          updatedFiles = getFilesByLimitType(updatedFiles, limitType.value)
        }

        emit('input', updatedFiles);
        // Handle the results (e.g., store them or update UI)
      } catch (err) {
        console.error('Error fetching files:', err);
      } finally {
        // Set loading state to false after all fetches are done
        isLoading.value = false;
      }
    }

    function limitFiles() {
      if (limit.value && limit.value > 0) return Number(limit.value)
      return -1
    }

    function makeIndexFiles (index) {
      if (props.value) return index + props.value.length
      else return index
    }

    async function fetchfileData (uuid) {
      isLoading.value = true;
      const url = endpoint.value + '/files/' + uuid + '?format=select:human';

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        return result; // Return the result to be collected in the parent function
      } catch (err) {
        return null; // Return null in case of error
      } finally {
        isLoading.value = false;
      }
    };

    function removeAllAssets () {
      emit('input', []);
      isOverLimit.value = false;
    };

    function removeURLParameter (url, parameter) {
      //prefer to use l.search if you have a location/link object
      var urlparts = url.split('?');   
      if (urlparts.length >= 2) {

          var prefix = encodeURIComponent(parameter) + '=';
          var pars = urlparts[1].split(/[&;]/g);

          //reverse iteration as may be destructive
          for (var i = pars.length; i-- > 0;) {    
              //idiom for string.startsWith
              if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
                  pars.splice(i, 1);
              }
          }

          return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
      }
      return url;
    }

    function checkExist (file) {
      return props.value.some((item) => item.uuid === file.uuid);
    };

    async function refreshAssets () {
      if (isProxy(props.value))  await updatFiles(toRaw(props.value), true)
      else await updatFiles(props.value, true)
    };

    function getIsOverLimit () {
      return isOverLimit.value
    }

    function getTotalAssets () {
      return props.value ? props.value.length : 0;
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
            filters: {
              mimeTypes: limitType.value, // Replace with an array of MIME types if needed
            }
          })
          .use(XHRUpload)
          .on('export', async (files, popupExportSuccessMsgFn, downloadFilesPackagedFn, downloadFileFn) => {
            await updatFiles(files)
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
.text-small-size {
  font-size: 12px;
}

.exceeds-the-limit {
  font-size: 12px;
  color: red;
  text-align: right;
}

.column {
  flex: 1; /* This makes the columns take equal space */
  padding: 8px;
  box-sizing: border-box; /* Ensures padding doesn't affect the total width */
}

.ml-1 {
  margin-left: 0.5rem;
}

.flex {
  display: flex;
  flex-wrap: wrap; /* Ensures the columns wrap in smaller viewports */
  gap: 20px
}

.flex-justify-content-end {
  justify-content: flex-end;
}

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
  cursor: pointer;
  padding: 2px;
}

.btn-drag-item {
  position: absolute;
  top: 60px;
  right: 2px;
  cursor: grab;
  padding: 2px;
}

.remove-all {
  text-align: right;
}
.remove-all span {
  color: red;
  font-size: 12px;
  border:none;
  background: none;
  width: 100%;
}
.remove-all span:hover {
  cursor: pointer;
  color: rgb(185, 37, 37);
}
.asset-content {
  max-height: 545px;
  overflow-y: scroll;
  padding: 0 10px;
}

.thumb-wrapper:first-of-type { margin-top: 0; }

.asset-content::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(174, 174, 174, 0.3);
	border-radius: 10px;
	background-color: #F5F5F5;
}

</style>
