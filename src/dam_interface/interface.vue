<template>
  <link rel="stylesheet" type="text/css"
        href="https://scaleflex.cloudimg.io/v7/plugins/filerobot-widget/v3/latest/filerobot-widget.min.css"/>
  <input :value="JSON.stringify(value)" type="hidden" id="sfx_value"/>

  <div id="sfx-result">
    <draggable class="asset-content" :list="value" @change="log">
      <div v-for="(item, index) in value" :key="index" class="media-container">
        <!-- Kiểm tra loại file và hiển thị phù hợp -->
        <template v-if="isImage(item.type)">
          <div class="sfx-item">
            <div class="sfx-item-inner">
              <div class="btn-drag-item">
                <VIcon name="drag_handle"/>
              </div>
              <div class="sfx-media-icon" target="_blank">
                <a :href="item.cdn" target="_blank">
                  <img :src="createThumbnail(item.cdn)" :alt="item.name" class="media-item"/>
                  <VIcon color="white" name="visibility" :xsmall="true" class="media-item-icon"/>
                </a>
              </div>
              <div class="item-info">
                <span>{{ trimText(item.name) }}</span>
              </div>
            </div>
            <div class="btn-delete-item" @click="deleteItem(index)">
              <VIcon name="close"/>
            </div>
          </div>
          <div v-if="configVariantsExist">
            <div v-for="variant in item.variants">
              <div @click="showVariantDialog(item, variant)">{{variant.name}}</div>
            </div>
          </div>
        </template>
        <template v-else-if="isVideo(item.type)">
          <div class="sfx-item">
            <div class="sfx-item-inner">
              <div class="btn-drag-item">
                <VIcon name="drag_handle"/>
              </div>
              <div class="sfx-media-icon" target="_blank">
                <a :href="item.cdn" target="_blank">
                  <VIcon class="item-icon" name="videocam"/>
                  <VIcon color="white" name="visibility" :xsmall="true" class="media-item-icon"/>
                </a>
              </div>
              <div class="item-info">
                <span>{{ trimText(item.name) }}</span>
              </div>
            </div>
            <div class="btn-delete-item" @click="deleteItem(index)">
              <VIcon name="close"/>
            </div>
          </div>
        </template>
        <template v-else-if="isAudio(item.type)">
          <div class="sfx-item">
            <div class="sfx-item-inner">
              <div class="btn-drag-item">
                <VIcon name="drag_handle"/>
              </div>
              <div class="sfx-media-icon" target="_blank">
                <a :href="item.cdn" target="_blank">
                  <VIcon  class="item-icon" name="play_circle"/>
                  <VIcon color="white" name="visibility" :xsmall="true" class="media-item-icon"/>
                </a>
              </div>
              <div class="item-info">
                <span>{{ trimText(item.name) }}</span>
              </div>
            </div>
            <div class="btn-delete-item" @click="deleteItem(index)">
              <VIcon name="close"/>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="sfx-item">
            <div class="sfx-item-inner">
              <div class="btn-drag-item">
                <VIcon name="drag_handle"/>
              </div>
              <div class="sfx-media-icon" target="_blank">
                <a :href="item.cdn" target="_blank">
                  <VIcon class="item-icon" name="draft"/>
                  <VIcon color="white" name="visibility" :xsmall="true" class="media-item-icon"/>
                </a>
              </div>
              <div class="item-info">
                <span>{{ trimText(item.name) }}</span>
              </div>
            </div>
            <div class="btn-delete-item" @click="deleteItem(index)">
              <VIcon name="close"/>
            </div>
          </div>
        </template>
      </div>
    </draggable>

    <div class="bottom-message">
      <div v-if="getTotalAssets() > 0" class="column align-left">
        <span>Total: {{ getTotalAssets() }}</span>
        <span v-if="limitFiles() > 0"> / Limit {{ limitFiles() }}</span>
      </div>
    </div>
    <div style="display: flex; align-items: center; justify-content: end;" v-if="getIsOverLimit()"
         class="exceeds-the-limit">
      <span class="ml-1">Exceeded maximum number of assets</span>
    </div>
    <VDialog v-model="dialogVisible">
      <v-card class="dialog-content">
        <v-card-title>Scaleflex DAM</v-card-title>
        <v-card-text>Are you sure you want to delete everything? Please confirm to proceed.</v-card-text>
        <v-card-actions>
        <VButton
          @click="removeAllAssets"
          :warning="true"
        >
          Yes
        </VButton>

        <VButton
          @click="closeDialog"
          :secondary="true"
        >
          No
        </VButton>
        </v-card-actions>
      </v-card>
    </VDialog>

    <VDialog v-model="isShowVariantDialog">
      <VCard style="width: 70%" class="dialog-content">
        <VCardTitle>
          Edit Image Variants
        </VCardTitle>
        <VCardText>
          <div style="display: flex; justify-content: space-between; border: 1px solid lightgray; height: 500px">
            <div id="variants-toolbar" style="width: 50px; padding: 5px; display: flex; align-items: center; justify-content: start; flex-direction: column; border-right: 1px solid lightgray;">
              <div
                  @click="changeToolbar('size')"
                  :class="{ toolbar_item_active: currentToolbar === 'size'}"
                  class="toolbar-item"><VIcon :small="true" name="width_wide"/></div>
              <div
                  @click="changeToolbar('crop')"
                  :class="{ toolbar_item_active: currentToolbar === 'crop'}"
                  class="toolbar-item"><VIcon :small="true" name="crop"/></div>
              <div
                  @click="changeToolbar('addition')"
                  :class="{ toolbar_item_active: currentToolbar === 'addition'}"
                  class="toolbar-item"><VIcon :small="true" name="flip"/></div>
            </div>
            <div id="variants-toolbar-config"  style="width: 250px; border-right: 1px solid lightgray; padding: 10px; display: flex; flex-direction: column;" >
              <div id="variants-toolbar-config-size" v-if="currentToolbar === 'size'">
                <div style="display: flex; justify-content: start;">
                  <VCheckbox :small="true" v-model="currentVariantConfigs['org_if_sml']" />
                  <span>Prevent enlargement</span>
                </div>
                <div>
                  <span>Width</span>
                  <VInput :small="true" v-model="currentVariantConfigs['width']" />
                </div>
                <div style="margin-top: 15px">
                  <span>Height</span>
                  <VInput :small="true" v-model="currentVariantConfigs['height']" />
                </div>
              </div>
              <div id="variants-toolbar-config-crop" v-if="currentToolbar === 'crop'">
                Crop
              </div>
              <div id="variants-toolbar-config-addition" v-if="currentToolbar === 'addition'">
                Addition
              </div>
            </div>
            <div id="variants-toolbar-image"  style="width: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden; max-height: 80%">
              <img style="height: 70%; width: auto" :src="currentVariantShow" />
            </div>
          </div>
        </VCardText>
      </VCard>
    </VDialog>
  </div>

  <div v-if="isTokenAndSecExists" class="toolbar">
    <VButton
        @click="openModal"
        :disabled="addAssetsDisabled()"
    >
      <VIcon name="image"/>
      <span style="margin-left: 5px">Browse assets</span>
    </VButton>

    <div>
      <VButton
          type="button"
          @click="refreshAssets()"
          v-if="getTotalAssets() > 0"
          :loading="getIsLoading()"
          :outlined="true"
      >
        <VIcon name="refresh"/>
        <span style="margin-left: 5px">Refresh</span>
      </VButton>

      <VButton
          style="margin-left: 5px"
          type="button"
          @click="clickRemoveAllAssets()"
          v-if="getTotalAssets() > 0"
          :danger="true"
      >
        <VIcon name="delete"/>
        <span style="margin-left: 5px">Remove all</span>
      </VButton>
    </div>
  </div>
  <div v-else>
    <VCard style="max-width: 100%; margin-top: 20px">
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
import {ref, onMounted, toRaw, isProxy} from "vue";
import {useApi} from "@directus/extensions-sdk";
import {VueDraggableNext} from "vue-draggable-next";

export default {
  components: {
    draggable: VueDraggableNext,
  },
  props: {
    value: {
      type: String,
      default: null,
    },
    collection: {type: String, default: 'scaleflex_dam_settings'},
    id: {type: Number, default: 1},
    title: {
      type: String,
      default: 'Scaleflex DAM',
    },
    custom: {type: Boolean, default: false},
    limit: {type: Number, default: 0},
    limitTypes: {type: String, default: null},
    attributes: {type: String, default: null},
    config: {type: Object, default: null},
  },
  watch: {
    currentVariantConfigs: {
      handler(newConfigs, oldConfigs) {
        this.updateCurrentVariantShow();
      },
      deep: true,
    },
    "currentVariantConfigs.width"(newW, oldW) {
      this.updateCurrentVariantShow();
    },
    "currentVariantConfigs.height"(newH, oldH) {
      this.updateCurrentVariantShow();
    },
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
    hasQueryString(url) {
      try {
        const urlObject = new URL(url);
        return urlObject.search.length > 0;
      } catch (error) {
        return false;
      }
    },
    createThumbnail(url) {
      if (!this.hasQueryString(url)) return url + '?width=100&height=100'
      else return url + '&width=100&height=100'
    },
    trimText(filename) {
      const maxLength = 50;
      if (filename.length <= maxLength) {
        return filename;
      }
      const lastDotIndex = filename.lastIndexOf(".");
      const baseName = lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;
      const extension = lastDotIndex !== -1 ? filename.substring(lastDotIndex) : "";
      const baseMaxLength = maxLength - extension.length - 3; // 3 for "..."
      const truncatedBaseName = baseName.substring(0, Math.max(baseMaxLength, 0));
      return truncatedBaseName + "..." + extension;
    },
    updateCurrentVariantShow() {
      const baseUrl = this.currentVariantShow.split("?")[0];
      const query = new URLSearchParams({
        width: this.currentVariantConfigs.width,
        height: this.currentVariantConfigs.height,
      }).toString();

      this.currentVariantShow = `${baseUrl}?${query}`;
      console.log("Updated currentVariantShow:", this.currentVariantShow);
    },
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
    const configVariantsExist = ref(false);
    const isShowVariantDialog = ref(false);
    const currentVariantShow = ref(null);
    const currentToolbar = ref("size");
    const currentVariantConfigs = ref({
      width: null,
      height: null,
      org_if_sml: false,
    });

    onMounted(() => {
      init();
    });

    function closeVariantDialog()
    {
      isShowVariantDialog.value = false
      currentVariantShow.value = null
    }

    function showVariantDialog(item, variant) {
      isShowVariantDialog.value = true;
      currentVariantShow.value = variant.img_url;

      const url = new URL(variant.img_url);
      const width = url.searchParams.get("width");
      const height = url.searchParams.get("height");

      currentVariantConfigs.value = {
        width: width,
        height: height,
      };

      console.log(`${variant.img_url} Width: ${width}, Height: ${height}`);
    }


    function toDamSetting(){
      const damButton = document.querySelector('a[href="/admin/scaleflex-dam-setting"]');
      if (damButton) {
        damButton.click();
      }
    }

    function changeToolbar(toolbar) {
      currentToolbar.value = toolbar;
    }

    return {
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
      log,
      closeDialog,
      clickRemoveAllAssets,
      dialogVisible,
      isTokenAndSecExists,
      configVariantsExist,
      toDamSetting,
      closeVariantDialog,
      showVariantDialog,
      isShowVariantDialog,
      currentVariantShow,
      currentToolbar,
      changeToolbar,
      currentVariantConfigs
    };

    function log() {
      emit('input', toRaw(props.value));
    }
    
    function addAssetsDisabled() {
      if (limit.value === getTotalAssets() && getTotalAssets() > 0) return true;
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
      document.getElementById("sfx-modal").setAttribute("style", "display: none");
      emit('close');
      isOpen.value = false;
    }

    function openModal() {
      document.getElementById("sfx-modal").setAttribute("style", "display: block");
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

        if (props.config && 'variants' in props.config) configVariantsExist.value = true
        
      } catch (error) {

      }
    }

    function getAttributesData(file) {
      let r = {};
      if (attributes.value.length > 0) {
        let arr = attributes.value
        for (let value of arr) {
          let valueTrim = value.trim();
          r[valueTrim] = file[valueTrim]
        }
        return r
      }
    }

    function checkLimit(updatedFiles) {
      if (limitFiles() > 0 && updatedFiles.length > limitFiles()) {
        isOverLimit.value = true
      } else {
        isOverLimit.value = false
      }
    }

    function getTypeAssets(type) {
      let arr = type.split("/");
      return arr[0]
    }

    function getFilesByLimitType(updatedFiles, limitType) {
      const limitTypeArr = limitType;
      if (limitTypeArr.includes('document')) return updatedFiles.filter((file) => limitTypeArr.includes(getTypeAssets(file.type)) || !['image', 'video', 'audio'].includes(getTypeAssets(file.type)))
      else return updatedFiles.filter((file) => limitTypeArr.includes(getTypeAssets(file.type)))
    }

    function getFileUuid(file) {
      const uuidArray = file.uuid.split("_");
      return uuidArray[0];
    }

    function replaceURLParameters(oldUrl, newUrl) {
      // Function to get all param from URL convert to object
      function getURLParameters(url) {
        const queryString = url.split('?')[1];
        if (!queryString) return {};
        const params = queryString.split('&');
        const result = {};
        params.forEach(param => {
          const [key, value] = param.split('=');
          result[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
        return result;
      }

      // Function create the new URL with the new param
      function buildURLWithParameters(baseUrl, params) {
        const queryString = Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        return baseUrl.split('?')[0] + '?' + queryString;
      }

      // get param from old url
      const oldParams = getURLParameters(oldUrl);
      // build the new url
      return buildURLWithParameters(newUrl, oldParams);
    }

    async function updateFiles(updatedFiles, isRefresh = false) {
      isLoading.value = true;

      const fetchPromises = updatedFiles.map(async (file, index) => {
        try {
          // Call fetchfileData for each file's uuid (assuming file has a 'uuid' property)
          let uuid = '';

          if (isRefresh) uuid = getFileUuid(file);
          else uuid = file.file.uuid;

          const response = await fetchfileData(uuid);
          let cdnLink = '';

          cdnLink = response?.file?.url.cdn;
          if (file.file?.url.download !== undefined) {
            cdnLink = file.file?.url.download;
          }

          if (isRefresh) {
            cdnLink = replaceURLParameters(file.cdn, cdnLink)
          }

          const tempFile = {
            uuid: response?.file?.uuid + '_' + makeIndexFiles(index),
            name: response?.file?.name,
            cdn: removeURLParameter(cdnLink, 'vh'),
            extension: response?.file?.extension,
            source: 'filerobot',
            type: response?.file?.type,
            ownerName: response?.file?.owner?.name,
          };

          if (configVariantsExist && tempFile.type.startsWith("image")) {
            const imageUrls = []
            const variants = props.config.variants
            for (let value of variants) {
              const params = new URLSearchParams(value.preset);
              const updatedUrl = `${tempFile.cdn}?${params.toString()}`;
              imageUrls.push({
                "code": value.code,
                "name": value.name,
                "img_url": updatedUrl
              })
            }
            tempFile['variants'] = imageUrls
          }

          if (attributes.value.length > 0) {
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

        if (limitType.value.length > 0) {
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

    function makeIndexFiles(index) {
      if (props.value) return index + props.value.length
      else return index
    }

    async function fetchfileData(uuid) {
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

    function clickRemoveAllAssets() {
      dialogVisible.value = true;
    };

    function removeAllAssets() {
      emit('input', []);
      isOverLimit.value = false;
      dialogVisible.value = false;
    };

    function removeURLParameter(url, parameter) {
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

    function checkExist(file) {
      return props.value.some((item) => item.uuid === file.uuid);
    };

    async function refreshAssets() {
      if (isProxy(props.value)) await updateFiles(toRaw(props.value), true)
      else await updateFiles(props.value, true)
    };

    function getIsOverLimit() {
      return isOverLimit.value
    }

    function getTotalAssets() {
      return props.value ? props.value.length : 0;
    }

    function closeDialog () {
      dialogVisible.value = false;
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
            await updateFiles(files)
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
.exceeds-the-limit {
  color: red;
}

.ml-1 {
  margin-left: 0.5rem;
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

.sfx-media-icon {
  width: 34px;
  height: 34px;
  border-radius: 25%;
  position: relative; /* Ensure the pseudo-element is positioned relative to this container */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-item-icon {
  position: absolute!important;
  top: 7px;
  left: 5px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 9999;
}

.sfx-media-icon::after {
  content: ''; /* Empty content to create the pseudo-element */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  height: 100%;
  background-color: #0c3745;
  opacity: 0; /* Start with no visibility */
  transition: opacity 0.3s ease; /* Smooth fade in/out effect */
  backdrop-filter: blur(5px); /* Apply blur effect */
}

.sfx-media-icon:hover .media-item-icon{
  opacity: 1;
}

.sfx-media-icon:hover::after {
  opacity: 0.85; /* Show the white blur overlay on hover */
}

.sfx-media-icon img {
  width: 34px;
  height: 34px;
  display: block;
  margin: 0 auto;
  object-fit: cover;
  border-radius: 25%;
}

.sfx-item .item-info {
  margin-left: 12px;
}

.sfx-item .item-info a {
  color: var(--theme--primary);
}

.sfx-item-inner {
  display: flex;
  align-items: center;
}

.bottom-message {
  display: flex;
  align-items: center;
  justify-content: end;
  margin-top: var(--v-list-item-margin, 4px);
}

.sfx-item {
  padding: 6px;
  border: var(--theme--border-width) solid var(--v-list-item-border-color, var(--theme--form--field--input--border-color));
  border-radius: var(--theme--border-radius);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--v-list-item-color, var(--v-list-color, var(--theme--foreground)));
  margin-top: var(--v-list-item-margin, 4px);
  cursor: pointer;
  transition: border-color 500ms ease;
}

.sfx-item:hover {
  border: var(--theme--border-width) solid var(--v-list-item-border-color-hover, var(--theme--form--field--input--border-color-hover));
}

.sfx-media-icon .icon {
  width: 80px;
  height: 80px;
  position: relative;
}

.btn-delete-item:hover {
  color: var(--theme--danger);
}

.sfx-media-icon .icon i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(50%, 50%);
  font-size: 35px;
}

.item-icon{
  width: 34px!important;
  text-align: center;
  padding: 0 var(--v-list-item-margin, 4px);
}

.remove-all span {
  color: red;
  font-size: 12px;
  border: none;
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
}

.btn-drag-item {
  margin-right: 8px;
  cursor: move;
  cursor: grab;
}

.btn-drag-item:active {
  cursor: grabbing;
}

.asset-content::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(174, 174, 174, 0.3);
  border-radius: 10px;
  background-color: #F5F5F5;
}

.toolbar{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--v-list-item-margin, 4px);
}


.container .v-card{
  max-width: 80%;
}

.toolbar-item{
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--v-list-item-margin, 4px);
  transition: background-color 500ms ease, text-color 500ms ease;
  border-radius: var(--v-list-item-border-radius, var(--theme--border-radius));
}

.toolbar_item_active{
  background: var(--theme--primary);
  color: white;
}

.toolbar-item:hover{
  background: var(--theme--primary);
  color: white;
}

</style>
