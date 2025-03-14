<template>
  <link rel="stylesheet" type="text/css"
        href="https://scaleflex.cloudimg.io/v7/plugins/filerobot-widget/v3/latest/filerobot-widget.min.css"/>
  <input :value="JSON.stringify(value)" type="hidden" id="sfx_value"/>

  <div id="sfx-result">
    <draggable class="asset-content" :list="value" @change="log">
      <div v-for="(item, index) in value" :key="index" class="media-container">
        <template v-if="isImage(item.type)">
          <div class="sfx-item">
            <div class="sfx-item-inner">
              <div class="btn-drag-item">
                <VIcon name="drag_handle"/>
              </div>
              <div class="sfx-media-icon">
                <a :href="item.cdn" target="_blank">
                  <img :src="createThumbnail(item.cdn)" :alt="item.name" class="media-item"/>
                  <VIcon color="white" name="visibility" :xsmall="true" class="media-item-icon"/>
                </a>
              </div>
              <div class="item-info">
                <span>{{ trimText(item.name) }}</span>
              </div>
            </div>
            <div class="flex-center-end">
              <div  v-if="configVariantsExist" class="show-variants"
                    @click="showVariants(item.uuid)">
                <VButton :xSmall="true"
                         :warning="showVariantsList.indexOf(item.uuid) > -1"
                         :outlined="true">
                  <VIcon style="margin-right: 5px" v-if="showVariantsList.indexOf(item.uuid) === -1" name="visibility" :xSmall="true" />
                  <VIcon style="margin-right: 5px" v-if="showVariantsList.indexOf(item.uuid) > -1" name="visibility_off" :xSmall="true" />
                  <span v-if="showVariantsList.indexOf(item.uuid) === -1">Show variants</span>
                  <span v-if="showVariantsList.indexOf(item.uuid) > -1">Hide variants</span>
                </VButton>
              </div>
              <div class="btn-delete-item" @click="deleteItem(index)">
                <VIcon name="close"/>
              </div>
            </div>
          </div>
          <div class="variants-container"
               v-if="configVariantsExist && showVariantsList.indexOf(item.uuid) > -1">
            <div class="sfx-item variant-item"
                 @click="showVariantsList.indexOf(item.uuid) > -1"
                 :small="true"
                 v-for="(variant, index) in item.variants"
                 :key="index"
            >
              <div class="variant-info">
                <img :src="variant.img_url" :alt="item.name" class="media-item variant-img" width="30" height="30"/>
                <span class="variant-name">{{ variant.name }}</span>
              </div>
              <div class="variant-actions">
                <VButton class="margin-right"
                         :xSmall="true"
                         :outlined="true"
                         @click="showVariantDialog(item, variant)">
                  Edit
                </VButton>
                <VButton :xSmall="true"
                         :secondary="true"
                         @click="openEditModal(item, variant)">
                  Replace
                </VButton>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="isVideo(item.type)">
          <div class="sfx-item">
            <div class="sfx-item-inner">
              <div class="btn-drag-item">
                <VIcon name="drag_handle"/>
              </div>
              <div class="sfx-media-icon">
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
              <div class="sfx-media-icon">
                <a :href="item.cdn" target="_blank">
                  <VIcon class="item-icon" name="play_circle"/>
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
              <div class="sfx-media-icon">
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
    <div v-if="getIsOverLimit()" class="exceeds-the-limit">
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
      <VCard class="dialog-content w-70">
        <VCardTitle>
          Edit Image Variants
        </VCardTitle>
        <VCardText class="position-relative">
          <div class="variant-toolbar">
            <div id="variants-toolbar-config">
              <div id="variants-toolbar-config-size">
                <div class="margin-bottom">
                  <span class="font-16">Size</span>
                  <p class="font-12 justify-text" style="hyphens: auto;">Change width and height of the image</p>
                </div>
                <div>
                  <span>Width</span>
                  <VInput :small="true" v-model="currentVariantConfigs['width']" />
                </div>
                <div class="margin-top">
                  <span>Height</span>
                  <VInput :small="true" v-model="currentVariantConfigs['height']" />
                </div>
              </div>
            </div>
            <div id="variants-toolbar-image" class="grid-bg variant-image-container">
              <div class="variant-buttons">
                <VButton  v-if="!showCrop" @click="toggleCrop" :icon="true" :xSmall="true" :secondary="true" class="margin-left crop-btn">
                  <VIcon name="crop" :xSmall="true" />
                </VButton>
                <VButton v-if="showCrop" @click="updateVariantByCrop" :icon="true" :xSmall="true" class="margin-left save-crop-btn">
                  <VIcon name="save" :xSmall="true" />
                </VButton>
              </div>
              <img v-if="!showCrop" class="image-preview" :src="currentVariantShow"/>
              <div v-if="showCrop">
                <cropper
                    class="cropper"
                    ref="cropper"
                    :src="currentVariantOrigin"
                    :default-size="{
                      width: cropWidth,
                      height: cropHeight
                    }"
                    :stencil-props="{
                      resizable: false,
                    }"
                />
              </div>
            </div>
          </div>
          <div class="btn-close-variant" @click="closeVariantDialog">
            <VIcon name="close"/>
          </div>
        </VCardText>
        <v-card-actions>
          <VButton
              @click="saveVariant"
              :warning="true"
          >
            Save
          </VButton>
          <VButton
              @click="closeVariantDialog"
              :secondary="true"
          >
            Cancel
          </VButton>
        </v-card-actions>
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
    <VCard class="notice-card">
      <VCardTitle class="notice-title">
        <VIcon name="report"/>
        <span class="notice-text">Scaleflex DAM Notice</span>
      </VCardTitle>
      <VCardText class="notice-body">
        Please visit the <span class="notice-link" @click="toDamSetting">Scaleflex DAM Configuration</span>
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
import { Cropper } from 'vue-advanced-cropper'
import { debounce } from "lodash";
import 'vue-advanced-cropper/dist/style.css';
import 'vue-advanced-cropper/dist/theme.compact.css';
import '../assets/style.css';

export default {
  components: {
    draggable: VueDraggableNext,
    Cropper,
  },
  props: {
    value: {
      type: String,
      default: null,
    },
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
      handler: debounce( function (newConfigs, oldConfigs) {
        const width = newConfigs.width;
        const height = newConfigs.height;
        if (this.showCrop) {
          this.$refs.cropper.setCoordinates(({ coordinates, imageSize }) => {
            return {
              width,
              height,
              left: imageSize.width/2 - width/2,
              top: imageSize.height/2 - height/2
            }
          });
        } else {
          this.updateCurrentVariantShow();
        }
        this.cropWidth = width;
        this.cropHeight = height;
      }, 500),
      deep: true,
    }
  },
  methods: {
    showVariants(itemUUID) {
      const index = this.showVariantsList.indexOf(itemUUID);
      if (index > -1) {
        this.showVariantsList.splice(index, 1);
      } else {
        this.showVariantsList.push(itemUUID);
      }
    },
    updateVariantByCrop() {
      const { coordinates, canvas } = this.$refs.cropper.getResult();
      this.showCrop = false;
      this.currentVariantConfigs.width = coordinates.width;
      this.currentVariantConfigs.height = coordinates.height;
      const tl_px = `${coordinates.left},${coordinates.top}`;
      const br_px = `${coordinates.left + coordinates.width},${coordinates.top + coordinates.height}`;
      this.currentVariantConfigs.tl_px = tl_px;
      this.currentVariantConfigs.br_px = br_px;
    },
    toggleCrop() {
      this.showCrop = !this.showCrop;
    },
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
      const query = new URLSearchParams(this.currentVariantConfigs).toString();
      this.currentVariantShow = `${baseUrl}?${query}`;
    }
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
    const currentItemVariantShow = ref(null);
    const currentConfigVariantShow = ref(null);
    const currentVariantOrigin = ref(null);
    const showCrop = ref(false);
    const showVariantsList = ref([]);
    const currentVariantConfigs = ref({
      width: 100,
      height: 100,
    });
    const cropWidth = ref(0);
    const cropHeight = ref(0);

    onMounted(() => {
      init();
    });

    function closeVariantDialog() {
      isShowVariantDialog.value = false
      currentVariantShow.value = null
      showCrop.value = false;
    }

    function removeAllQuery(url) {
      return url.split('?')[0]; // Split the URL at '?' and return the part before it
    }

    function showVariantDialog(item, variant) {
      isShowVariantDialog.value = true;
      currentVariantShow.value = variant.img_url;
      currentItemVariantShow.value = item;
      currentConfigVariantShow.value = variant;
      currentVariantOrigin.value = removeAllQuery(variant.img_url);
      const url = new URL(variant.img_url);
      const width = url.searchParams.get("width");
      const height = url.searchParams.get("height");
      const tl_px = url.searchParams.get("tl_px");
      const br_px = url.searchParams.get("br_px");
      currentVariantConfigs.value = {
        width: width,
        height: height,
        tl_px,
        br_px
      };
      cropWidth.value = width;
      cropHeight.value = height;
    }

    async function relaceVariantDialog(item, variant) {
      const frConfig = {
        token: token.value,
        sec: sec.value,
        directory: directory.value,
        limitType: limitType.value,
      }
      renderEditWidget(frConfig, item, variant);
    }

    function toDamSetting() {
      const damButton = document.querySelector('a[href="/admin/scaleflex-dam-setting"]');
      if (damButton) {
        damButton.click();
      } else {
        window.location.href = "/admin/scaleflex-dam-setting"
      }
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
      currentVariantConfigs,
      showVariantsList,
      currentVariantOrigin,
      showCrop,
      openEditModal,
      cropWidth,
      cropHeight,
      saveVariant
    };

    function log() {
      emit('update:value', toRaw(props.value));
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
      emit('update:value', value);
    }

    function closeModal() {
      document.getElementById("sfx-modal").setAttribute("style", "display: none");
      emit('close');
      isOpen.value = false;
    }

    function openEditModal(item, variant) {
      document.getElementById("sfx-modal").setAttribute("style", "display: block");
      isOpen.value = true;
      relaceVariantDialog(item, variant);
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

        if (props.config && 'variants' in props.config) configVariantsExist.value = true;

      } catch (error) {
        console.error(error);
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
        return r;
      }
    }

    function checkLimit(updatedFiles) {
      const limit = limitFiles();
      isOverLimit.value = limit > 0 && updatedFiles.length > limit;
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
            cdn: checkAndRemoveQueryMark(removeURLParameter(cdnLink, 'vh')),
            extension: response?.file?.extension,
            source: 'filerobot',
            type: response?.file?.type,
            ownerName: response?.file?.owner?.name,
          };

          if (configVariantsExist.value && tempFile.type.startsWith("image")) {
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

        emit('update:value', updatedFiles);
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
        return await response.json(); // Return the result to be collected in the parent function
      } catch (err) {
        return null; // Return null in case of error
      } finally {
        isLoading.value = false;
      }
    }

    function clickRemoveAllAssets() {
      dialogVisible.value = true;
    }

    function removeAllAssets() {
      emit('update:value', []);
      isOverLimit.value = false;
      dialogVisible.value = false;
    }

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

    async function refreshAssets() {
      if (isProxy(props.value)) await updateFiles(toRaw(props.value), true)
      else await updateFiles(props.value, true)
    }

    function getIsOverLimit() {
      return isOverLimit.value
    }

    function getTotalAssets() {
      return props.value ? props.value.length : 0;
    }

    function removeQueryMark(url) {
      // Remove trailing '?' if there are no query parameters after it
      return url.replace(/\?$/, '');
    }

    function checkAndRemoveQueryMark(url) {
      // Check if the URL contains query parameters
      if (url.includes('?') && url.split('?')[1].length === 0) {
        // If only '?' is present, remove it
        return removeQueryMark(url);
      }
      // Otherwise, return the URL as is
      return url;
    }

    function genQueryParameters(url, params) {
      return `${checkAndRemoveQueryMark(url)}?${params.toString()}`
    }

    function saveVariant() {
      const item = currentItemVariantShow.value;
      const variant =  currentConfigVariantShow.value;
      let currentFiles = toRaw(props.value);
      const fileIndex = currentFiles.findIndex(file => file.uuid === item.uuid);
      const currentFileEdit = currentFiles[fileIndex]
      const currentVariantIndexEdit  = currentFileEdit.variants.findIndex(currentVariant => currentVariant.code === variant.code);
      const variantConfigs = currentVariantConfigs.value;
      let cdnLink = variant.img_url;
      for (let configKey of Object.entries(variantConfigs)) {
        cdnLink = removeURLParameter(cdnLink, configKey[0]);
      }
      const params = new URLSearchParams(variantConfigs);
      currentFiles[fileIndex]['variants'][currentVariantIndexEdit]['img_url'] = genQueryParameters(cdnLink, params);
      showVariantsList.value = []
      showVariantsList.value = [item.uuid]
      emit('update:value', currentFiles);
      closeVariantDialog()
    }

    function editFile(file, item, variant) {
      let currentFiles = toRaw(props.value);
      const fileIndex = currentFiles.findIndex(file => file.uuid === item.uuid);
      const currentFileEdit = currentFiles[fileIndex]
      const currentVariantIndexEdit  = currentFileEdit.variants.findIndex(currentVariant => currentVariant.code === variant.code);
      const currentVariant = props.config.variants.find(currentVariant => currentVariant.code === variant.code);
      const params = new URLSearchParams(currentVariant.preset);
      let cdnLink = removeURLParameter(file.link, 'vh');
      currentFiles[fileIndex]['variants'][currentVariantIndexEdit]['img_url'] = genQueryParameters(cdnLink, params);
      showVariantsList.value = []
      showVariantsList.value = [item.uuid]
      emit('update:value', currentFiles);
    }

    function closeDialog() {
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
              successful.forEach((item, key) => {
                // do something
              });
            }
          });
    }

    function renderEditWidget(frConfig, item, variant) {
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
            editFile(files[0], item, variant)
            closeModal();
          })
          .on('complete', ({failed, uploadID, successful}) => {
            if (failed) {
              console.dir(failed);
            }

            if (successful) {
              successful.forEach((item, key) => {
                // do something
              });
            }
          });
    }
  }
};
</script>