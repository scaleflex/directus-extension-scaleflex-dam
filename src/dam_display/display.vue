<template>
  <div class="media-container">
    <div
        v-for="(item, index) in displayedItems"
        :key="index"
        class="media-item-wrapper"
        :class="{ 'hovered': hoveredIndex === index }"
        :style="{
          zIndex: hoveredIndex === index ? 100 : index + 1,
          marginLeft: index > 0 ? '-12px' : '0'
        }"
        @mouseover="hoveredIndex = index"
        @mouseleave="hoveredIndex = null"
    >
      <div
          v-if="isImage(item.type)"
          class="media-item circle"
          :style="{ backgroundImage: `url(${createThumbnail(item.cdn)})` }"
          :alt="item.name"
      ></div>
      <div
          v-else
          class="media-item circle icon-wrapper"
      >
        <VIcon
            :class="`item-icon ${item.type}`"
            :name="getIconName(item.type)"
            :small="true"
        />
      </div>
    </div>
    <div v-if="value.length > limit" class="media-item-wrapper extra-items">
      <div class="media-item circle icon-wrapper">
        <span class="extra-count">+{{ value.length - limit }}</span>
      </div>
    </div>
  </div>
</template>


<script>
import './assets/style.css';
export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    limit: {
      type: Number,
      default: 2,
    }
  },
  data() {
    return {
      hoveredIndex: null,
    };
  },
  computed: {
    displayedItems() {
      return this.value.slice(0, this.limit);
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
    getIconName(type) {
      if (this.isVideo(type)) return "videocam";
      if (this.isAudio(type)) return "play_circle";
      return "draft";
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
      if (!this.hasQueryString(url)) return url + "?width=100&height=100";
      else return url + "&width=100&height=100";
    },
  },
};
</script>