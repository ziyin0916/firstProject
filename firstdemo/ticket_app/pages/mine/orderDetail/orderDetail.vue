<template>
	<view>
		<view class="order_status_view">
			<view>{{orderInfo.orderState == 1 ? '待使用': '已完成'}}</view>
			<image :src="orderInfo.orderState == 1 ? '/static/mine/order_wait_use.png' : '/static/mine/order_finished.png'"></image>
		</view>
		<view class="ticket_view">
			<view v-for="(item, index) in dataList" :key="index" class="order" :style="index < dataList.length - 1 ? 'border-bottom: 2rpx #F4F4F4 dashed;' : ''"
			 @click="ticketClick(item)">
				<view class="ticket_item">
					<image class="left_image" :src="getImgView(item.showImgUrl)" mode="aspectFill"></image>
					<view class="right_view">
						<view class="item_title">{{item.showName}}</view>
						<view class="item_content">
							<image src="/static/home/home_place.png"></image>
							<view>{{item.venueName}}</view>
						</view>
						<view class="item_content">
							<image src="/static/home/home_time.png"></image>
							<view>{{item.showTime}}</view>
						</view>
						<view class="item_content">
							<image src="/static/home/home_address.png"></image>
							<view>{{item.showCriName || ''}}{{item.showSite || ''}}</view>
						</view>
					</view>
					<image class="right_image" :src="item.ticketState == 1 ? '/static/mine/ticket_unuse.png' : item.ticketState == 2 ? '/static/mine/ticket_used.png' : item.ticketState == 3 ? '/static/mine/ticket_refunding.png' : '/static/mine/ticket_refunded.png'"></image>
				</view>
			</view>
		</view>
		<view class="footer_view">
			<view>共 <span class="ticket_number">{{orderInfo.showNumber || ''}}</span> 张票</view>
			<view class="ticket_price">实付金额：￥{{orderInfo.orderMoney || ''}}</view>
			<view><span class="order_number">订单编号：</span>{{orderInfo.orderNo || ''}}</view>
			<view><span class="order_time">订单时间：</span>{{orderInfo.orderTime || ''}}</view>
		</view>
	</view>
</template>

<script>
	import utils from '@/utils/utils.js'
	export default {
		data() {
			return {
				orderId: '',
				dataList: [],
				orderInfo: {},
				
				comeFrom: ''
			}
		},
		onLoad(option) {
			this.orderId = option.orderId
			// orderConfirm 购买页
			this.comeFrom = option.from || ''
			this.getOrderDetailInfo()
		},
		onBackPress() {
			if (this.comeFrom == 'orderConfirm') {
				uni.switchTab({
					url: '/pages/mine/mine'
				})
				return true
			}
		},
		onUnload() {
			if (this.comeFrom == 'orderConfirm') {
				uni.switchTab({
					url: '/pages/mine/mine'
				})
			}
		},
		onShow() {
			if (this.orderId.length > 0) {
				this.getOrderDetailInfo()
			}
		},
		methods: {
			getImgView(url) {
				return utils.getImgView(url)
			},
			getOrderDetailInfo() {
				let that = this
				this.$api.requestOrderDetailInfo({
					id: this.orderId
				}).then(res => {
					that.orderInfo = res.data.result.busOrder || {}
					that.dataList = res.data.result.busOrderTicketList || []
					// ticketState 1:待使用; 2:已使用; 3: 退款中; 4: 已退票
				})
			},
			ticketClick(item) {
				uni.navigateTo({
					url: '/pages/mine/ticketDetailInfo/ticketDetailInfo?id=' + item.id
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F5F5F5;
		padding-bottom: 30rpx;
		box-sizing: border-box;
	}

	.order_status_view {
		width: 100%;
		height: 120rpx;
		background: linear-gradient(90deg, #FADB88, #F7C642);
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		padding: 0 60rpx;
		box-sizing: border-box;

		image {
			height: 80rpx;
			width: 80rpx;
		}
	}

	.ticket_view {
		margin-top: 20rpx;
		background-color: white;
		padding: 0 20rpx;
		box-sizing: border-box;

		.ticket_item {
			width: 100%;
			min-height: 320rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx 0;
			box-sizing: border-box;

			.left_image {
				width: 200rpx;
				height: 290rpx;
			}

			.right_view {
				width: calc(100% - 330rpx);
				min-height: 290rpx;
				margin-left: 30rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;

				.item_title {
					font-size: 32rpx;
					color: #333333;
					font-weight: bold;
				}

				.item_content {
					width: 100%;
					display: flex;
					align-items: center;

					image {
						width: 30rpx;
						height: 30rpx;
					}

					view {
						width: calc(100% - 45rpx);
						font-size: 26rpx;
						color: #333333;
						margin-left: 15rpx;
						margin-top: 10rpx;
					}
				}

				.item_bottom {
					width: 100%;
					height: 50rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 10rpx;

					.number_view {
						font-size: 32rpx;
						font-weight: bold;
						color: #FE2536;
						line-height: 50rpx;

						span {
							font-size: 26rpx;
							color: #333333;
							font-weight: normal;
							margin-left: 10rpx;
						}
					}

					.price_view {
						font-size: 28rpx;
						color: #333333;
						line-height: 50rpx;

						span {
							font-weight: 32rpx;
							font-weight: bold;
							color: #FE2536;
						}
					}

				}
			}

			.right_image {
				width: 100rpx;
				height: 100rpx;
			}
		}
	}

	.footer_view {
		margin-top: 20rpx;
		padding: 20rpx;
		box-sizing: border-box;
		font-size: 24rpx;
		line-height: 60rpx;
		color: #999999;
		background-color: white;

		.ticket_number {
			font-size: 30rpx;
			font-weight: bold;
			color: black;
			padding: 0 10rpx;
			box-sizing: border-box;
		}

		.ticket_price {
			font-size: 30rpx;
			font-weight: bold;
			color: black;
		}

		.order_number {
			font-size: 30rpx;
		}

		.order_time {
			font-size: 30rpx;
		}
	}
</style>
