<template>
	<view class="check_error">
		<image src="/static/mine/ticket_check_error.png"></image>
		<view class="mark">此演出票已被使用</view>
		<view class="confirm" @click="confirmClick">确定</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			confirmClick() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="less">
	.check_error {
		width: 100%;
		height: 100%;
		padding: 100rpx 80rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		image {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50rpx;
			// background-color: gray;
		}
		.mark {
			margin-top: 60rpx;
			font-size: 30rpx;
		}
		
		.confirm {
			margin-top: 100rpx;
			width: calc(100% - 40rpx);
			height: 100rpx;
			line-height: 100rpx;
			font-size: 40rpx;
			text-align: center;
			border-radius: 50rpx;
			background-color: #F7C642;
		}
		
	}
</style>
