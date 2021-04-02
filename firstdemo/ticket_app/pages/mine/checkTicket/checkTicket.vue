<template>
	<view class="check_ticket">
		<view class="top_pic">
			<image src="../../../static/mine/scan_ticket.png"></image>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		
		<!-- #endif -->
		<view class="submit_button" @click="scanClick">点击扫码验票</view>
	</view>
</template>

<script>
	export default {
		methods: {
			scanClick() {
				uni.navigateTo({
					url: 'scanTicket'
				})
			}
		}
	}
</script>

<style lang="less">
	
	.check_ticket {
		width: 100%;
		height: 100%;
		padding-top: 200rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		
		.top_pic {
			width: 500rpx;
			height: 800rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		
		.submit_button {
			position: fixed;
			left: 40rpx;
			bottom: 60rpx;
			width: calc(100% - 80rpx);
			height: 100rpx;
			line-height: 100rpx;
			font-size: 40rpx;
			text-align: center;
			border-radius: 50rpx;
			background-color: #F7C642;
		}
	}
</style>
