<template>
	<view class="apply_refund_view">
		<view class="ticket_view">
			<view class="ticket_title">
				<view>可选的票</view>
				<view class="choose_all" @click="chooseAll">全选</view>
			</view>
			<view v-for="(item, index) in dataList" :key="index" class="ticket_item" :style="index < dataList.length - 1 ? 'border-bottom: 2rpx #F4F4F4 dashed;' : ''"
			 @click="ticketClick(item)">
				<image class="choose_image" :src="item.isChoosed ? '/static/mine/refund_selected.png' : '/static/mine/refund_unselect.png'"></image>
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
				<image class="right_image" src="../../../static/mine/ticket_unuse.png"></image>
			</view>
		</view>
		<view class="bottom_view">
			<view class="refund_reason_header">
				<view>退款原因</view>
				<view class="choose_reason_title" :style="refundReason.value ? 'color: #000' : ''" @click="chooseRefundReason">
					<view>{{refundReason.value ? refundReason.value : '点击选择原因(必选)'}} </view>
					<image src="/static/home/to_right.png"></image>
				</view>
			</view>
			<textarea class="refund_reson_desc" v-model="refundReasonDesc" placeholder="补充详细信息以便商家更快帮您处理（选填）" maxlength="100"></textarea>
			<view class="refund_money">
				<view>退款金额</view>
				<view>￥{{refundMoney}}</view>
			</view>
			<view class="refund_remark">退款将原路返回</view>
			<view class="submit_button" @click="submitClick">提交</view>
		</view>

		<view class="mask_view" v-if="showReasonView" @touchmove.stop.prevent="() => {}" @click="closeReasonView">
			<view class="reason_back_view">
				<view class="reason_title">退款原因</view>
				<view v-for="(item, index) in reasonList" :key="index" class="reason_item" @click.stop="reasonItemClick(item)">
					<view>{{item.value}}</view>
					<image :src="item.key == refundReason.key ? '/static/mine/reason_selected.png' : '/static/mine/reason_unselect.png'"></image>
				</view>
				<view style="height: 110rpx;"></view>
				<view class="reason_cancel">取消</view>
			</view>
		</view>
		
		<view class="success_back_view" id="success_back_view" v-if="showPaySuccessView" @touchmove.stop.prevent="() => {}">
			<view class="success_view" id='success_view' ref="container">
				<image src="/static/mine/refund_success.png"></image>
				<view class="title">提交成功</view>
				<view class="remark">请等待平台人员审核</view>
				<view class="option_button" @click="confirmButtonClick">知道了</view>
			</view>
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
				refundMoney: 0,
				refundTicketNumber: 0,
				refundTicketIds: '',
				
				refundReason: {},
				refundReasonDesc: '',
				
				showReasonView: false,
				reasonList: [],
				
				showPaySuccessView: false,
				
				isLoading: false,
			}
		},
		onLoad() {
			this.getOrderDetailInfo()
		},
		onLoad(option) {
			this.orderId = option.orderId
			this.getRefundReasonList()
			this.getOrderDetailInfo()
		},
		methods: {
			getImgView(url) {
				return utils.getImgView(url)
			},
			getRefundReasonList() {
				let that = this
				this.$api.requestDictData({
					code: 'bus_refund_type'
				}).then(res => {
					that.reasonList = res.data.result
				})
			},
			getOrderDetailInfo() {
				let that = this
				this.$api.requestOrderDetailInfo({
					id: this.orderId
				}).then(res => {
					that.orderInfo = res.data.result.busOrder || {}
					let ticketList = res.data.result.busOrderTicketList || []
					that.dataList = ticketList.filter(ele => ele.ticketState == 1)
					// ticketState 1:待使用; 2:已使用; 3: 退款中; 4: 已退票
				})
			},
			ticketClick(item) {
				item.isChoosed = !item.isChoosed
				this.setupRefundPrice()
			},
			chooseAll() {
				this.dataList.forEach(ele => {
					ele.isChoosed = true
				})
				this.setupRefundPrice()
			},
			setupRefundPrice() {
				this.refundMoney = 0
				this.refundTicketNumber = 0
				this.refundTicketIds = ''
				this.dataList.forEach(ele => {
					if (ele.isChoosed) {
						this.refundMoney += parseFloat(ele.showFares) * 1000
						this.refundTicketNumber++
						this.refundTicketIds += ele.id + ','
					}
				})
				this.refundMoney = this.refundMoney / 1000
			},
			chooseRefundReason() {
				this.showReasonView = true
			},
			closeReasonView() {
				this.showReasonView = false
			},
			reasonItemClick(item) {
				this.refundReason = item
				this.closeReasonView()
			},
			
			submitClick() {
				if (this.refundTicketNumber == 0) {
					utils.showToastNoIcon('请选择要退的票')
					return
				}
				if (!this.refundReason.key) {
					utils.showToastNoIcon('请选择退款原因')
					return
				}
				if (this.isLoading) {
					return
				}
				this.isLoading = true
				this.$api.requestTicketRefund({
					id: this.refundTicketIds,
					refundState: this.refundReason.key,
					refundCause: this.refundReasonDesc,
				}).then(res => {
					this.showPaySuccessView = true
					this.isLoading = false
				}).catch(err => {
					this.isLoading = false
				})
			},
			confirmButtonClick() {
				this.showPaySuccessView = false
				uni.navigateBack()
				
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F5F5F5;
	}

	.ticket_view {
		background-color: white;
		padding: 0 20rpx;
		box-sizing: border-box;

		.ticket_title {
			width: 100%;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 36rpx;
			font-weight: bold;

			.choose_all {
				font-size: 26rpx;
				font-weight: normal;
				color: #999999;
				padding: 0 20rpx;
				box-sizing: border-box;
			}
		}

		.ticket_item {
			width: 100%;
			min-height: 320rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx 0;
			box-sizing: border-box;

			.choose_image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
			}

			.left_image {
				width: 160rpx;
				height: 220rpx;
			}

			.right_view {
				width: calc(100% - 290rpx - 50rpx);
				min-height: 220rpx;
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

	.bottom_view {
		margin-top: 20rpx;
		width: 100%;
		padding: 0 20rpx 80rpx;
		box-sizing: border-box;
		background-color: white;

		.refund_reason_header {
			width: 100%;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 36rpx;
			font-weight: bold;

			.choose_reason_title {
				font-size: 24rpx;
				font-weight: normal;
				display: flex;
				align-items: center;
				color: #999999;

				image {
					width: 30rpx;
					height: 30rpx;
					margin-left: 10rpx;
				}
			}
		}

		.refund_reson_desc {
			width: 100%;
			height: 200rpx;
			background-color: #F4F4F4;
			padding: 20rpx;
			box-sizing: border-box;
			font-size: 28rpx;
		}

		.refund_money {
			width: 100%;
			height: 80rpx;
			padding-top: 20rpx;
			box-sizing: border-box;
			font-size: 32rpx;
			font-weight: bold;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.refund_remark {
			font-size: 24rpx;
			color: #999999;
		}

		.submit_button {
			margin-top: 80rpx;
			margin-left: 40rpx;
			width: calc(100% - 80rpx);
			height: 100rpx;
			line-height: 100rpx;
			font-size: 40rpx;
			text-align: center;
			border-radius: 50rpx;
			background-color: #F7C642;
		}
	}

	.mask_view {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		background-color: rgba(0, 0, 0, 0.4);

		.reason_back_view {
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			min-height: 600rpx;
			background-color: white;
			border-top-left-radius: 40rpx;
			border-top-right-radius: 40rpx;
			padding: 20rpx 20rpx 0;
			box-sizing: border-box;

			.reason_title {
				font-size: 34rpx;
				width: 100%;
				height: 100rpx;
				line-height: 100rpx;
				text-align: center;
			}

			.reason_item {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				font-size: 28rpx;
				color: #666666;
				display: flex;
				align-items: center;
				justify-content: space-between;

				image {
					width: 40rpx;
					height: 40rpx;
				}
			}

			.reason_cancel {
				position: absolute;
				left: 0;
				bottom: 0;
				width: 100%;
				height: 100rpx;
				line-height: 100rpx;
				font-size: 30rpx;
				font-weight: bold;
				text-align: center;
				border-top: 2rpx solid #DDDDDD;
			}
		}
	}
	
	.success_back_view {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 999;
		background-color: rgba(0, 0, 0, 0.3);
		padding: 0 80rpx;
		padding-bottom: 160rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	
		.success_view {
			width: 100%;
			// height: 500rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			border-radius: 40rpx;
			overflow: hidden;
			background-color: white;
			padding-top: 50rpx;
			box-sizing: border-box;
	
			image {
				width: 220rpx;
				height: 220rpx;
			}
	
			.title {
				font-size: 36rpx;
				font-weight: bold;
				line-height: 100rpx;
			}
	
			.remark {
				text-align: center;
				font-size: 30rpx;
				line-height: 50rpx;
				color: #666666;
				padding-bottom: 50rpx;
				box-sizing: border-box;
			}
	
			.option_button {
				width: 100%;
				height: 100rpx;
				line-height: 100rpx;
				font-size: 36rpx;
				border-top: #EEEEEE solid 2rpx;
				text-align: center;
			}
		}
	}
</style>
