<template>
  <private-view title="Scaleflex DAM Settings">
    <div class="sfx-padding-box">
      <div style="margin-bottom: 1rem">
        <label for="sfx_token"><b>Token</b></label>
        <VInput v-model="token" />
      </div>
      <div style="margin-bottom: 1rem">
        <label for="sfx_sec"><b>Security Template</b></label>
        <VInput v-model="sec" />
      </div>
      <div style="margin-bottom: 1rem">
        <label for="sfx_token"><b>Root Directory</b></label>
        <VInput v-model="directory" />
      </div>
      <div style="margin-bottom: 1rem">
        <label for="limit"><b>Limit</b></label>
        <VInput v-model="limit" type="number" />
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
      </div>
      <VButton :disabled="loading" @click="saveSfxToken">
        <span v-if="loading">Processing...</span>
        <span v-else>Save</span>
      </VButton>
    </div>
  </private-view>
</template>

<script>
import { ref } from 'vue';
import { useApi, useStores } from '@directus/extensions-sdk';

export default {
  props: {
    collection: { type: String, default: 'scaleflex_dam_settings' },
    id: { type: Number, default: 1 },
  },
  setup(props) {
    const { useCollectionsStore } = useStores();
    const api = useApi();
    const collectionsStore = useCollectionsStore();

    const token = ref('');
    const sec = ref('');
    const directory = ref('');
    const limit = ref('');
    const attributes = ref([]);
    const limitType = ref([]);
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
            meta: { note: 'Scaleflex DAM' },
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

    async function createFields() {
      const fieldsPayload = [
        {
          type: 'string',
          meta: { interface: 'input', special: null },
          field: 'token',
        },
        {
          type: 'string',
          meta: { interface: 'input', special: null },
          field: 'sec',
        },
        {
          type: 'string',
          meta: { interface: 'input', special: null },
          field: 'directory',
        },
        {
          type: 'number',
          meta: { interface: 'input', special: null },
          field: 'limit',
        },
        {
          type: 'string',
          meta: { interface: 'input', special: null },
          field: 'attributes',
        },
        {
          type: 'string',
          meta: { interface: 'input', special: null },
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
      const payload = { token: '', sec: '', directory: '/', limit: null, limitType: '', attributes: '' }
      try {
        await api.post(`/items/${props.collection}`, payload);
      } catch (error) {
        console.error(`Failed to create data: ${error.message}`);
      }
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
          attributes.value = data.attributes.split(",") || []
          limitType.value = data.limitType.split(",") || []
        }
      } catch (error) {
        console.error(`Error loading data: ${error.message}`);
      }
    }

    async function saveSfxToken() {
      loading.value = true;
      try {
        let limitTypeString = limitType.value.toString();
        let attributesString = attributes.value.toString();
        const payload = { token: token.value, sec: sec.value, directory: directory.value, limit: limit.value, attributes: attributesString, limitType: limitTypeString };
        await api.patch(`/items/${props.collection}/${props.id}`, payload);
        alert('Settings saved successfully!');
      } catch (error) {
        alert('Failed to save settings. Please try again.');
        console.error(`Error saving data: ${error.message}`);
      } finally {
        loading.value = false;
      }
    }

    ensureCollectionExists().then(loadData);

    return { token, sec, directory, saveSfxToken, loading, limit, attributes, limitType };
  },
};
</script>

<style>
.sfx-padding-box {
  padding: 0 32px 32px;
}
</style>
