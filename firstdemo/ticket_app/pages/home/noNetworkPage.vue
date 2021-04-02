<template>
	<view style=" display: flex; flex-direction: column; align-items: center; justify-content: center;">
		<image src="@/static/no_network.png" style="width: 250rpx; height: 250rpx; margin-top: 150rpx;"></image>
		<view style="font-size: 40rpx; font-weight: bold;line-height: 60rpx; margin-top: 40rpx;">网络不给力</view>
		<view style="font-size: 26rpx; color: #999999; margin-top: 40rpx;">点击刷新，再试一下吧~</view>
		<view style="width: 300rpx; height: 100rpx; margin-top: 60rpx; line-height: 100rpx; background-color: #F7C642; text-align: center; font-size: 32rpx; font-weight: bold; border-radius: 50rpx;" @click="refreshNetwork()">立即刷新</view>
	</view>
</template>

<script>
	export default {
		methods: {
			refreshNetwork() {
				uni.getNetworkType({
				    success: function (res) {
						if (res.networkType != 'none') {
							uni.reLaunch({
								url: '/pages/home/home'
							})
						}
				    }
				});
			}
		}
	}
</script>

<style>
</style>
