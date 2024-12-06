<template>
  <private-view title="Scaleflex DAM">
    <VCard style="margin:0 32px 32px 32px; max-width: 100%">
      <VCardTitle style="padding: 10px">
        About Scaleflex DAM
      </VCardTitle>
      <VCardText style="padding: 10px; width: 100%">
        Scaleflex DAM(Filerobot) is a scalable and performance-oriented Digital Asset Management platform with integrated image and video optimizers to store, organize,
        optimize and deliver your media assets such as images, videos, PDFs and many other brand assets fast all around the world to all device types.
      </VCardText>
    </VCard>
    <div class="sfx-padding-box">
      <div style="margin-bottom: 1rem">
        <label for="sfx_token"><b>Token</b></label>
        <VInput v-model="token"/>
        <p class="guide-text">Scaleflex DAM token from your account, you can obtain a token by fill in <a style="color: var(--theme--primary)"
            href="https://www.scaleflex.com/contact-us" target="_blank">Scaleflex contact page</a></p>
      </div>
      <div style="margin-bottom: 1rem">
        <label for="sfx_sec"><b>Security Template</b></label>
        <VInput v-model="sec"/>
        <p class="guide-text">To load the Scaleflex DAM Widget or Scaleflex DAM Image Editor, you you need to create a
          Security Template in your Asset Hub first,
          in order for your Directus instantiation of the Widget to obtain proper credentials and access your
          storage</p>
      </div>
      <div style="margin-bottom: 1rem">
        <label for="sfx_token"><b>Root Directory</b></label>
        <VInput v-model="directory"/>
        <p class="guide-text">The directory in your Hub, where the files will be stored</p>
      </div>
      <div style="margin-bottom: 1rem">
        <label for="limit"><b>Limit</b></label>
        <VInput v-model="limit" type="number"/>
        <p class="guide-text">The max number of files that can be added to a single field, <b style="color:tomato">default: 0(unlimited)</b></p>
      </div>
      <div style="margin-bottom: 1rem">
        <label for="attributes"><b>Attributes</b></label>
        <VSelect
            v-model="attributes"
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
        <p class="guide-text">A string containing information (JSON attributes) that you want to store in a Directus
          field</p>
      </div>

      <div style="margin-bottom: 1rem">
        <label for="limitType"><b>Limit Type</b></label>
        <VSelect
            v-model="limitType"
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
      <div v-if="!isValid" style="margin-bottom: 1rem">
        Config như shit
      </div>
      <VButton :disabled="loading" @click="saveSfxToken">
        <span v-if="loading">Processing...</span>
        <span v-else>Update</span>
      </VButton>
    </div>
    <VDialog v-model="dialogVisible">
      <template #activator="{ on }">
        <button @click="on">Open Dialog</button>
      </template>
      <v-card class="dialog-content">
        <v-card-title>Dialog Title</v-card-title>
        <v-card-text>Centered dialog content goes here.</v-card-text>
        <v-card-actions>
          <button @click="dialogVisible = false">Close</button>
        </v-card-actions>
      </v-card>
    </VDialog>
  </private-view>
</template>

<script>
import {ref} from 'vue';
import {useApi, useStores} from '@directus/extensions-sdk';

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
    const isValid = ref(null);
    const loading = ref(false);
    const collectionExists = ref(false);

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

          console.log(`Collection ${collectionName} created.`);

          // Sau khi tạo collection xong, hidden collection
          await hiddenCollection();

          // Sau khi tạo collection xong, tạo các fields
          await createFields();

          collectionExists.value = false; // Đánh dấu rằng collection vừa được tạo
        } else {
          console.log(`Collection ${collectionName} already exists.`);
          collectionExists.value = true;
        }
      } catch (error) {
        console.error(`Error ensuring collection exists: ${error.message}`);
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

    async function saveSfxToken() {
      loading.value = true;
      isValid.value = checkToken();

      if (!isValid.value) {

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
          alert('Settings saved successfully!');
        } catch (error) {
          alert('Failed to save settings. Please try again.');
          console.error(`Error saving data: ${error.message}`);
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

    ensureCollectionExists().then(loadData);
    const dialogVisible = true;
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
      dialogVisible
    };
  },
};
</script>

<style>
.sfx-padding-box {
  padding: 0 32px 32px;
}

#check_token_content {
  position: relative;
}

.guide-text {
  font-size: 13px;
  margin-top: 5px;
  color: #285c72;
}
</style>
