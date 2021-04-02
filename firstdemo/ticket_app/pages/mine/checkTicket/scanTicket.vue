<template>
	<view>
		<camera style="width: 100%; height: 100vh;" mode="scanCode" device-position="back" flash="off" @scancode="getCode"></camera>
	</view>
</template>

<script>
	
	const app = getApp()
	export default {
		data() {
			return {
				scanIsEnable: true,
				checkResult: true
			}
		},
		onLoad() {

		},
		onShow() {
			this.scanIsEnable = true
		},
		methods: {
			getCode(e) {
				let that = this
				if (that.scanIsEnable) {
					that.scanIsEnable = false
					let ticketNo = e.detail.result || ''
					this.$api.requestTicketVerification({
						ticketNo
					}).then(() => {
						// if (that.checkResult == true) {
						const innerAudioContext = uni.createInnerAudioContext();
						innerAudioContext.src = app.globalData.successMusic
						innerAudioContext.onEnded(() => {
							console.log('innerAudioContext success stop');
							innerAudioContext.destroy()
							setTimeout(() => {
								that.scanIsEnable = true
							}, 500)
						})
						innerAudioContext.play()


						// } else {

						// }
					}).catch(err => {
						const innerAudioContext = uni.createInnerAudioContext();
						innerAudioContext.src = app.globalData.failureMusic
						innerAudioContext.onEnded(() => {
							console.log('innerAudioContext error stop');
							innerAudioContext.destroy()
							uni.navigateTo({
								url: 'checkTicketError'
							})
						})
						innerAudioContext.play()
					})
				}
			}
		}
	}
</script>

<style>
</style>
