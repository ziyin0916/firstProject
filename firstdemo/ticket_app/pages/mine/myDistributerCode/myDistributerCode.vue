<template>
	<view class="my_distribution_view">
		<view class="channel_title">所属渠道：{{channel}}</view>
		<view class="qr_view">
			<tkiqrcode :val="distributionCode" :size="300" unit="upx" :onval="true" :loadMake="true" :usingComponents="true"
			 :showLoading="false" />
		</view>
		<view class="dis_code">推荐ID：{{distributionCode}}</view>
	</view>
</template>

<script>
	const app = getApp()
	import tkiqrcode from '@/components/tki-qrcode/tki-qrcode.vue'
	export default {
		components: {
			tkiqrcode
		},
		data() {
			return {
				channel: '',
				distributionCode: '',
			}
		},
		onLoad() {
			this.getUserInfo()
		},
		methods: {
			getUserInfo() {
				let that = this
				this.$api.requestUserInfoByOpenId({
					weChatOpenid: app.globalData.openid
				}).then(res => {
					let result = res.data.result || {}
					that.channel = result.channelId || ''
					that.distributionCode = result.id || ''
				})
			}
		}
	}
</script>

<style lang="less">
	.my_distribution_view {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 30rpx;
	}

	.channel_title {
		margin-top: 60rpx;
	}

	.qr_view {
		width: 100%;
		margin-top: 60rpx;
		display: flex;
		justify-content: center;
	}

	.dis_code {
		margin-top: 60rpx;
	}
</style>
