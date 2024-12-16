<template>
  <private-view title="Scaleflex DAM">
    <template #navigation>
      <div style="margin-top: 20px; padding: 0 10px">
          <div style="display: flex; flex-direction: column; align-content: center">
            <div v-if="isAdministrator" style="display: flex; background: var(--theme--navigation--project--background); padding: 5px 8px; border-radius: 4px; align-items: center;">
              <VIcon name="settings" style="color: var(--theme--primary)"/>
              <span style="margin-left: 4px; font-size: 14px;  display: block">Scaleflex DAM</span>
            </div>
            <div @click="toDam" class="external-link" style="margin-top: 8px">
              <VIcon name="gallery_thumbnail" style="color: var(--theme--primary)"/>
              <span style="margin-left: 4px; font-size: 14px;  display: block">Assets Library</span>
            </div>
            <a href="https://docs.scaleflex.com/digital-asset-management-dam/plugins-and-connectors/plugins/directus" target="_blank" class="external-link"  style="margin-top: 8px">
              <VIcon name="description" style="color: var(--theme--primary)" />
              <span style="margin-left: 4px; font-size: 14px;  display: block">Documentation</span>
            </a>
          </div>
      </div>
    </template>
    <VCard style="margin:0 32px 32px 32px; max-width: 100%">
      <VCardTitle style="padding: 15px">
        About Scaleflex DAM
      </VCardTitle>
      <VCardText style="padding: 15px; width: 100%; position: relative">
        <div style="display: flex; align-items: center; justify-content: start; margin-bottom: 20px">
          <img src="https://frzjaqrbb.filerobot.com/plugins_assets/scaleflex.svg" />
        </div>
        <div style="z-index: 999">
          Scaleflex DAM(Filerobot) is a scalable and performance-oriented Digital Asset Management platform with integrated image and video optimizers to store, organize,
          optimize and deliver your media assets such as images, videos, PDFs and many other brand assets fast all around the world to all device types.
        </div>
        <a href="https://www.scaleflex.com" target="_blank" class="homepage">
          <VIcon name="house" :small="true" style="margin-top: 2px"/>
          <span style="margin-left: 4px; font-size: 14px;  display: block">Scaleflex Home</span>
        </a>
        <img src="https://frzjaqrbb.filerobot.com/plugins_assets/dam.svg" style="position: absolute; right: 10px; top: -40px; width: 180px; z-index: 1; opacity: 0.4;" />
      </VCardText>
    </VCard>
    <div class="sfx-padding-box">
      <div style="font-size: 18px; margin-bottom: 20px">
        <h2 >Base configurations</h2>
        <p class="guide-text">The following fields are required to integrate the Scaleflex DAM Widget within Directus.</p>
      </div>
      <div style="margin-bottom: 1rem">
        <label for="sfx_token"><b>Token</b></label>
        <VInput :disabled="loading" v-model="token"/>
        <p class="guide-text">Scaleflex DAM token from your account, you can obtain a token by fill in <a style="color: var(--theme--primary)"
            href="https://www.scaleflex.com/contact-us" target="_blank">Scaleflex contact page</a></p>
      </div>
      <div style="margin-bottom: 1rem">
        <label for="sfx_sec"><b>Security Template</b></label>
        <VInput :disabled="loading" v-model="sec"/>
        <p class="guide-text">To load the Scaleflex DAM Widget or Scaleflex DAM Image Editor, you you need to create a
          Security Template in your Asset Hub first,
          in order for your Directus instantiation of the Widget to obtain proper credentials and access your
          storage</p>
      </div>
      <div style="margin-bottom: 1rem">
        <label for="sfx_token"><b>Root Directory</b></label>
        <VInput :disabled="loading" v-model="directory"/>
        <p class="guide-text">The directory in your Hub, where the files will be stored</p>
      </div>
      <VDivider style="margin: 20px 0" />
      <div style="font-size: 18px; margin-bottom: 20px">
        <h2 >Advanced configuration</h2>
        <p class="guide-text">This configuration will be overridden if 'Use Custom Setting' is activated in each Field Interface.</p>
      </div>
      <div style="margin-bottom: 1rem">
        <label for="limit"><b>Limit</b></label>
        <VInput :disabled="loading" min="0" v-model="limit" type="number"/>
        <p class="guide-text">The max number of files that can be added to a single field, <b style="color: var(--theme--primary)">default: 0(unlimited)</b></p>
      </div>
      <div style="margin-bottom: 1rem">
        <label for="attributes"><b>Attributes</b></label>
        <VSelect
            v-model="attributes"
            :disabled="loading"
            :items="[
            {
              text: 'Meta',
              value: 'meta',
            },
            {
              text: 'Tags',
              value: 'tags',
            },
            {
              text: 'Info',
              value: 'info',
            },
          ]"
            :multiplePreviewThreshold="4"
            :multiple="true"
        />
        <p class="guide-text">Attribute from Scaleflex DAM asset that you want to include in Client response</p>
      </div>

      <div style="margin-bottom: 1rem">
        <label for="limitType"><b>Limit Type</b></label>
        <VSelect
            v-model="limitType"
            :disabled="loading"
            :multiplePreviewThreshold="5"
            :items="[
            {
              text: 'Image',
              value: 'image',
            },
            {
              text: 'Document',
              value: 'document',
            },
            {
              text: 'Video',
              value: 'video',
            },
            {
              text: 'Audio',
              value: 'audio',
            },
          ]"
            :multiple="true"
        />
        <p class="guide-text">File types limit when use Widget</p>
      </div>
      <div>
        <VButton v-if="!loading" @click="saveSfxToken">
          <VIcon name="save" />
          <span style="margin-left: 5px">Save Settings</span>
        </VButton>
        <VButton style="margin-left: 15px" v-if="!loading && token !== '' && sec !== ''" @click="confirmResetAllSettings" :outlined="true" :danger="true">
          <VIcon name="restart_alt" />
          <span style="margin-left: 5px">Reset all settings</span>
        </VButton>
        <VButton :disabled="loading" v-if="loading">
          <span>Processing...</span>
        </VButton>
      </div>
    </div>

    <VDialog v-model="dialogVisible">
      <v-card class="dialog-content">
        <v-card-title>
          <div style="display: flex; justify-content: start; align-items: center;">
            <VIcon color="gray" v-if="dialogType === 'info'" name="info" />
            <VIcon color="tomato" v-if="dialogType === 'warning'" name="warning" />
            <VIcon color="green" v-if="dialogType === 'success'" name="check_circle" />
            <VIcon color="red" v-if="dialogType === 'danger'" name="error" />
            <span style="margin-left: 5px;">{{dialogTitle}}</span>
          </div>
        </v-card-title>
        <v-card-text style="padding:10px 35px;">{{dialogText}}</v-card-text>
        <v-card-actions>
          <VButton :outlined="true" v-if="dialogReset" @click="closeDialog">Cancel</VButton>
          <VButton :outlined="true" v-if="!dialogReset" @click="closeDialog">Close</VButton>
          <VButton :danger="true" v-if="dialogReset" @click="resetAllSettings">Reset</VButton>
          <VButton v-if="(dialogType === 'warning' || dialogType === 'danger') && !dialogReset" @click="closeDialog">
            Double check Settings
          </VButton>
        </v-card-actions>
      </v-card>
    </VDialog></private-view>
</template>

<script>
import {ref, onMounted} from 'vue';
import {useApi, useStores} from '@directus/extensions-sdk';
import { createDirectus, rest, readMe } from '@directus/sdk';

export default {
  props: {
    collection: {type: String, default: 'scaleflex_dam_settings'},
    id: {type: Number, default: 1},
  },
  setup(props) {
    const {useCollectionsStore} = useStores();
    const api = useApi();
    const collectionsStore = useCollectionsStore();

    const token = ref('');
    const sec = ref('');
    const directory = ref('');
    const limit = ref('');
    const attributes = ref([]);
    const limitType = ref([]);
    const isValid = ref(true);
    const loading = ref(false);
    const collectionExists = ref(false);
    const dialogVisible = ref(false);
    const dialogType = ref("info");
    const dialogTitle = ref(null);
    const dialogText = ref(null);
    const dialogReset = ref(false);
    const isAdministrator = ref(false);

    onMounted(() => {
      init();
    });

    async function init() {
      const client = createDirectus(process.env.PUBLIC_URL).with(rest());
      const result = await client.request(readMe({
		    fields: ['role.policies.policy.admin_access'],
	    }));

      if (result?.role?.policies) {
        const policies =  result?.role?.policies
        const hasAdminAccess = policies.some(item => item.policy.admin_access);
        isAdministrator.value = hasAdminAccess
        if (!hasAdminAccess) toDam()
      }
    }

    async function ensureCollectionExists() {
      loading.value = true;
      const collectionName = props.collection;

      try {
        // Kiểm tra xem collection đã tồn tại chưa
        const scaleflexCollection = await collectionsStore.getCollection(collectionName);

        if (!scaleflexCollection) {
          // Tạo collection mới nếu chưa tồn tại
          await collectionsStore.upsertCollection(collectionName, {
            collection: collectionName,
            meta: {note: 'Scaleflex DAM'},
            schema: {
              fields: [
                {
                  field: 'id',
                  type: 'uuid',
                  meta: {
                    primary_key: true,
                  },
                }
              ],
            },
          });


          // Sau khi tạo collection xong, hidden collection
          await hiddenCollection();

          // Sau khi tạo collection xong, tạo các fields
          await createFields();

          collectionExists.value = false; // Đánh dấu rằng collection vừa được tạo
        } else {
          collectionExists.value = true;
        }
      } catch (error) {
        // Nothing to handle
      } finally {
        loading.value = false;
      }
    }

    async function hiddenCollection() {
      try {
        let meta = {
          "meta": {
            "hidden": true
          }
        }
        await api.patch(`/collections/${props.collection}`, meta);
      } catch (error) {
        console.error(`Failed to hidden collection: ${error.message}`);
      }
    }

    async function createFields() {
      const fieldsPayload = [
        {
          type: 'string',
          meta: {interface: 'input', special: null},
          field: 'token',
        },
        {
          type: 'string',
          meta: {interface: 'input', special: null},
          field: 'sec',
        },
        {
          type: 'string',
          meta: {interface: 'input', special: null},
          field: 'directory',
        },
        {
          type: 'integer',
          meta: {interface: 'input', special: null},
          field: 'limit',
        },
        {
          type: 'string',
          meta: {interface: 'input', special: null},
          field: 'attributes',
        },
        {
          type: 'string',
          meta: {interface: 'input', special: null},
          field: 'limitType',
        },
      ];

      try {
        // Tạo từng field
        for (const field of fieldsPayload) {
          await api.post(`/fields/${props.collection}`, field);
          console.log(`Field ${field.field} created.`);
        }

        // Sau khi tạo fields xong, tạo dữ liệu mới
        await createFirstData();

      } catch (error) {
        console.error(`Failed to create fields: ${error.message}`);
      }
    }

    async function createFirstData() {
      const payload = {token: '', sec: '', directory: '/', limit: null, limitType: '', attributes: ''}
      try {
        await api.post(`/items/${props.collection}`, payload);
      } catch (error) {
        console.error(`Failed to create data: ${error.message}`);
      }
    }

    function isNull(value) {
      return value === '' || value === null
    }

    async function loadData() {
      try {
        if (collectionExists) {
          const response = await api.get(`/items/${props.collection}/${props.id}`);
          const data = response.data.data;
          token.value = data.token || '';
          sec.value = data.sec || '';
          directory.value = data.directory || '';
          limit.value = data.limit || 0;
          attributes.value = isNull(data.attributes) ? [] : data.attributes.split(",")
          limitType.value = isNull(data.limitType) ? [] : data.limitType.split(",")
        }
      } catch (error) {
        console.error(`Error loading data: ${error.message}`);
      }
    }

    async function resetAllSettings() {
      loading.value = true;
      try {
        const payload = {
          token: '',
          sec: '',
          directory: '/',
          limit: null,
          attributes: null,
          limitType: null
        };
        await api.patch(`/items/${props.collection}/${props.id}`, payload);
        dialogType.value = 'success';
        dialogTitle.value = 'Settings Reset Successfully';
        dialogText.value = 'All settings have been reset to their defaults. ' +
            'To continue using Scaleflex DAM with your model, please reconfigure your settings and verify them for seamless functionality.';
      } catch (error) {
        dialogType.value = 'danger';
        dialogTitle.value = 'System Error';
        dialogText.value = 'Failed to save settings. Please refresh the Page and try again.';
      } finally {
        loading.value = false;
        dialogReset.value = false;
        token.value = '';
        sec.value = '';
        directory.value = '';
        limit.value = '';
        attributes.value = [];
        limitType.value = [];
      }
    }


    async function confirmResetAllSettings() {
      dialogType.value = 'danger';
      dialogTitle.value = 'Reset All Settings';
      dialogText.value = 'Are you sure you want to reset all settings to their default values? This action cannot be undone and may affect your current configuration.';
      dialogVisible.value = true;
      dialogReset.value = true;
    }

    async function saveSfxToken() {
      loading.value = true;
      isValid.value = await checkToken();
      dialogVisible.value = true;
      if (!isValid.value) {
        dialogType.value = 'warning';
        dialogTitle.value = 'Invalid Settings';
        dialogText.value = 'Please verify your token and security template. The current configuration is incorrect and requires adjustment.'
      } else {
        try {
          let limitTypeString = limitType.value ? limitType.value.toString() : null;
          let attributesString = attributes.value ? attributes.value.toString() : null;

          const payload = {
            token: token.value,
            sec: sec.value,
            directory: directory.value,
            limit: limit.value,
            attributes: attributesString,
            limitType: limitTypeString
          };
          await api.patch(`/items/${props.collection}/${props.id}`, payload);
          dialogType.value = 'success';
          dialogTitle.value = 'Successfully Saved';
          dialogText.value = 'Your updates have been saved and are now active. You can now add the Scaleflex DAM Field to your schema and begin using it immediately.';
        } catch (error) {
          dialogType.value = 'danger';
          dialogTitle.value = 'System Error';
          dialogText.value = 'Failed to save settings. Please refresh the Page and try again.';
        } finally {
          loading.value = false;
        }
      }
      loading.value = false;
    }

    async function checkToken() {
      const url = `https://api.filerobot.com/${token.value}/v4/key/${sec.value}`;
      try {
        const response = await fetch(url);
        return response.status === 200;
      } catch (err) {
        return false
      }
    }

    function closeDialog () {
      dialogVisible.value = false;
    }

    function toDam() {
      const damButton = document.querySelector('a[href="/admin/scaleflex-dam"]');
      if (damButton) {
        damButton.click();
      }
    }

    ensureCollectionExists().then(loadData);
    return {
      token,
      sec,
      directory,
      saveSfxToken,
      loading,
      limit,
      attributes,
      limitType,
      isValid,
      dialogVisible,
      closeDialog,
      dialogText,
      dialogTitle,
      dialogType,
      confirmResetAllSettings,
      dialogReset,
      resetAllSettings,
      toDam,
      isAdministrator
    };
  },
};
</script>

<style>
.sfx-padding-box {
  padding: 0 32px 32px;
}

.guide-text {
  font-size: 13px;
  margin-top: 5px;
  color: #285c72;
}

.homepage{
  margin-top: 10px;
  display: flex;
  transition: color 500ms ease;
  cursor: pointer;
}

.homepage:hover{
  color: #285c72;
}

.external-link{
  display: flex;
  padding: 5px 8px;
  border-radius: 4px;
  transition: background 500ms ease;
  align-items: center;
  cursor: pointer;
}

.external-link:hover{
  background: var(--theme--navigation--project--background);
}
</style>
