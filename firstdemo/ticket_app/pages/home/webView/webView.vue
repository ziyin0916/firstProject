<template>
	<web-view :src="url"></web-view>
</template>

<script>
	import utils from '@/utils/utils.js'
	export default {
		data() {
			return {
				url: ''
			}
		},
		onLoad(option) {
			let path = option.url || ''
			this.url = utils.httpStrFormat(path)
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
