<template>
	<view class="ticket_detail_view">
		<view class="ticket_info_view">
			<image :src="getImgView(ticketInfo.showImgUrl)" mode="aspectFill"></image>
			<view class="right_view">
				<view class="item_title">{{ticketInfo.showName}}</view>
				<view class="item_content">
					<image src="/static/home/home_place.png"></image>
					<view>{{ticketInfo.venueName}}</view>
				</view>
				<view class="item_content">
					<image src="/static/home/home_time.png"></image>
					<view>{{ticketInfo.showTime}}</view>
				</view>
				<view class="item_content" @click="openLocation">
					<image src="/static/home/home_address.png"></image>
					<view>{{ticketInfo.showCriName || ''}}{{ticketInfo.showSite || ''}}</view>
				</view>
				<view class="item_bottom">
					<view class="price_view">￥{{ticketInfo.showFares || ''}} <span>x {{ticketNumber}}</span></view>
				</view>
			</view>
		</view>
		<view style="width: 100%; height: 20rpx; background-color: #F5F5F5;"></view>
		<view class="ticket_content_view">
			<view class="ticket_content_title">
				<view class="ticket_tab_item">
					<view>购票须知</view>
					<view class="sub_bottom_line"></view>
				</view>
			</view>
			<view class="detail_view">
				<rich-text :nodes="ticketInfo.showNotice" style="font-size: 28rpx;color: #666666;line-height: 50rpx; padding: 20rpx 0; box-sizing: border-box;"></rich-text>
			</view>
		</view>
		<view style="width: 100%; height: 130rpx;"></view>
		<view class="bottom_view">
			<view class="bottom_left">
				<view class="ticket_number">
					共 {{ticketNumber}} 张
				</view>
				<view class="ticket_price">
					￥ {{ticketTotalMoney}}
				</view>
			</view>
			<view class="bottom_right" @click="payButtonClick">立即付款</view>
		</view>
		<view class="success_back_view" id="success_back_view" v-if="showPaySuccessView" @touchmove.stop.prevent="touchVoid">
			<view class="success_view" id='success_view' ref="container">
				<image src="/static/home/pay_success.png"></image>
				<view class="title">购票成功</view>
				<view class="remark">请提前30分钟进入演出地点<br />等待验票入场</view>
				<view class="option_button" @click="confirmButtonClick">好的</view>
			</view>
		</view>
	</view>
</template>

<script>
	var app = getApp()
	import utils from '@/utils/utils.js'
	export default {
		data() {
			return {
				ticketId: '',
				ticketNumber: 0,
				ticketTotalMoney: 0,

				ticketInfo: {},

				showPaySuccessView: false,
				isClickBuy: false,
				orderNo: '',
			}
		},
		onLoad(option) {
			this.ticketId = option.ticketId || ''
			this.ticketNumber = option.ticketNumber || 0

			this.getTicketInfo()
		},

		methods: {
			touchVoid() {},
			getImgView(url) {
				return utils.getImgView(url)
			},
			getTicketInfo() {
				this.$api.requestTicketDetailInfo({
					id: this.ticketId
				}).then(res => {
					this.ticketInfo = res.data.result || {}
					this.ticketTotalMoney = Number(this.ticketInfo.showFares) * 10000 * this.ticketNumber / 10000
				})
			},

			// 开启导航
			openLocation() {
				let that = this
				uni.getLocation({
					type: 'gcj02',
					success() {
						uni.openLocation({
							latitude: parseFloat(that.ticketInfo.showLat),
							longitude: parseFloat(that.ticketInfo.showLng),
							scale: 18
						})
					},
					fail(err) {
						uni.showToast({
							title: '请点击"..." -> "设置", 打开小程序的定位后重试',
							icon: 'none',
							duration: 3000
						})
					}
				})
			},

			// 立即购买
			payButtonClick() {
				let that = this
				if (this.isClickBuy) {
					return
				}
				// this.isClickBuy = true
				this.$api.requestUserInfoByOpenId({
					weChatOpenid: app.globalData.openid
				}).then(res => {
					let result = res.data.result || {}
					if (result.phone && result.phone.length > 0) {
						that.beginSubmitOrder()
					} else {
						this.isClickBuy = false
						uni.navigateTo({
							url: '/pages/mine/authorization/authorization'
						})
					}
				}).catch(err => {
					that.isClickBuy = false
				})
			},
			
			beginSubmitOrder() {
				let that = this
				this.$api.requestSubmitOrder({
					goodsId: this.ticketId,
					showNumber: this.ticketNumber
				}).then(res => {
					// that.showPaySuccessView = true
					console.log(res);
					that.isClickBuy = false
					that.orderNo = res.data.result && res.data.result.orderData && res.data.result.orderData.orderNo
					let appPayString = res.data.result.payData.appPayString || {}
					uni.requestPayment({
						provider: 'wxpay',
						timeStamp: appPayString.timestamp + '',
						nonceStr: appPayString.nonce_str,
						package: appPayString.package,
						signType: appPayString.signType,
						paySign: appPayString.paySign,
						success(res) {
							console.log('success', res);
							if (res.errMsg === 'requestPayment:ok') {
								that.checkPayResult()
							} else {
								that.isClickBuy = false
								that.cancelAppPay()
							}
						},
						fail(err) {
							if (err.errMsg == 'requestPayment:fail cancel') {
								uni.showToast({
									title: '支付取消',
									icon: 'none',
									mask: true,
									duration: 5000
								})
							}
							that.isClickBuy = false
							that.cancelAppPay()
						}
					})
					
				}).catch(err => {
					that.isClickBuy = false
				})
			},
			
			checkPayResult() {
				let that = this
				this.$api.requestCheckPaymentResult({
					orderNo: this.orderNo
				}).then(res => {
					that.showPaySuccessView = true
				}).catch(() => {
					that.isClickBuy = false
				})
			},
			
			cancelAppPay() {
				this.$api.requestCancelAppPay({
					orderNo: this.orderNo
				}).then(res => {
					console.log('cancelAppPay', res);
				})
			},

			confirmButtonClick() {
				this.showPaySuccessView = false
				uni.navigateTo({
					url: '/pages/mine/orderDetail/orderDetail?from=orderConfirm&orderId=' + this.orderNo
				})
			},
		}
	}
</script>

<style lang="less">
	.ticket_detail_view {
		width: 100%;
		height: 100%;
		background-color: white;
		box-sizing: border-box;

		.ticket_info_view {
			width: 100%;
			min-height: 320rpx;
			padding: 15rpx 20rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;

			image {
				width: 200rpx;
				height: 290rpx;
			}

			.right_view {
				width: calc(100% - 230rpx);
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
						margin-top: 15rpx;
					}
				}

				.item_bottom {
					width: 100%;
					height: 50rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 10rpx;

					.price_view {
						font-size: 32rpx;
						font-weight: bold;
						color: #FE2536;
						line-height: 50rpx;

						span {
							font-size: 26rpx;
							font-weight: normal;
							color: #333333;
							margin-left: 12rpx;
						}
					}

					.choose_ticket_view {
						display: flex;
						align-items: center;
						height: 50rpx;

						.option_view {
							display: flex;
							align-items: center;

							.reduceImg {
								width: 40rpx;
								height: 40rpx;
							}

							.plusImg {
								width: 40rpx;
								height: 40rpx;
							}

							view {
								font-size: 28rpx;
								color: #333333;
								padding: 0 10rpx;
								box-sizing: border-box;
							}
						}

						.ticket_number_view {
							font-size: 28rpx;
							color: #999999;
							margin-left: 20rpx;

							span {
								font-size: 26rpx;
								color: #F7C642;
							}
						}
					}
				}
			}
		}

		.ticket_content_view {
			padding: 0 20rpx;
			box-sizing: border-box;

			.ticket_content_title {
				width: 100%;
				height: 100rpx;
				border-bottom: #EEEEEE solid 2rpx;
				display: flex;

				.ticket_tab_item {
					font-size: 32rpx;
					font-weight: bold;
					color: #333333;
					width: 100%;
					height: 100rpx;
					line-height: 100rpx;
					text-align: center;
				}
			}
		}

		.bottom_view {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0rpx;
			height: 130rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx;
			box-sizing: border-box;
			background-color: white;

			.bottom_left {
				display: flex;
				align-items: center;
				justify-content: space-around;
				width: 50%;
				height: 90rpx;
				line-height: 90rpx;

				.ticket_number {
					font-size: 24rpx;
					color: #333333;
				}

				.ticket_price {
					font-size: 32rpx;
					color: #FE2536;
					font-weight: bold;
				}
			}

			.bottom_right {
				width: 50%;
				height: 90rpx;
				line-height: 90rpx;
				border-radius: 45rpx;
				background-color: #F7C642;
				text-align: center;
				font-size: 36rpx;
				text-align: center;
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
					line-height: 120rpx;
				}

				.remark {
					text-align: center;
					font-size: 30rpx;
					line-height: 50rpx;
					color: #666666;
					padding-bottom: 30rpx;
					box-sizing: border-box;
				}

				.option_button {
					width: 100%;
					height: 100rpx;
					line-height: 100rpx;
					font-size: 34rpx;
					border-top: #EEEEEE solid 2rpx;
					text-align: center;
				}
			}
		}
	}
</style>
