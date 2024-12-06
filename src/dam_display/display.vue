<template>
	<div v-for="item in value">
		<div v-if="isImage(item.type)">
			<img :src="createThumbnail(item.cdn)" :alt="item.name" class="media-item"/>
		</div>
		<div v-else-if="isVideo(item.type)">
			<VIcon class="item-icon" name="videocam"/>
		</div>
		<div v-else-if="isAudio(item.type)">
			<VIcon class="item-icon" name="play_circle"/>
		</div>
		<div v-else>
			<VIcon class="item-icon" name="draft"/>
		</div>
	</div>
</template> 

<script>
export default {
	props: {
		value: {
			type: String,
			default: null,
		},
		show_images: {
			type: Boolean,
			default: false,
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
	},
	setup(props){
		function displayImages(){
			return '<>s'
		}
		return {displayImages};
	},
};
</script>