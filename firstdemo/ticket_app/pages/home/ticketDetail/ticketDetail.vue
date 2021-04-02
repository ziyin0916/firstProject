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
					<view class="price_view">￥{{ticketInfo.showFares || ''}}</view>
					<view class="choose_ticket_view">
						<view class="option_view">
							<image class="reduceImg" src="/static/home/reduce.png" @click="reduceClick"></image>
							<view>{{ticketBuyNumber}}</view>
							<image class="plusImg" src="/static/home/plus.png" @click="plusClick"></image>
						</view>
						<view class="ticket_number_view">
							剩余<span>{{ticketCurrentNumber}}</span>张
						</view>
					</view>
				</view>
			</view>
		</view>
		<view style="width: 100%; height: 20rpx; background-color: #F5F5F5;"></view>
		<view class="ticket_content_view">
			<view class="ticket_content_title">
				<view :class="tabIndex == 0 ? 'ticket_tab_item selected' : 'ticket_tab_item'" @click="ticketTabClick(0)">
					<view>演出详情</view>
					<view class="sub_bottom_line"></view>
				</view>
				<view :class="tabIndex == 1 ? 'ticket_tab_item selected' : 'ticket_tab_item'" @click="ticketTabClick(1)">
					<view>购票须知</view>
					<view class="sub_bottom_line"></view>
				</view>
			</view>
			<view class="detail_view">
				<rich-text v-if="tabIndex == 0" :nodes="ticketInfo.showDetails" space="ensp" style="font-size: 28rpx;color: #666666;line-height: 50rpx; padding: 20rpx 0; box-sizing: border-box;"></rich-text>
				<rich-text v-if="tabIndex == 1" :nodes="ticketInfo.showNotice" space="ensp" style="font-size: 28rpx;color: #666666;line-height: 50rpx; padding: 20rpx 0; box-sizing: border-box;"></rich-text>
			</view>
		</view>
		<view style="width: 100%; height: 130rpx;"></view>
		<view class="bottom_view">
			<view class="bottom_left">
				<!-- 微信小程序分享 -->
				<!-- #ifdef MP-WEIXIN -->
				<button class='share_btn' open-type="share">
					<image src="/static/home/share.png"></image>
					分享
				</button>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<image src="/static/home/share.png"></image>
				<view>分享</view>
				<!-- #endif -->
			</view>
			<view class="bottom_right" @click="buyTicketClick">立即购票</view>
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
				ticketInfo: {},
				ticketTotalNumber: 0,
				ticketCurrentNumber: 0,
				ticketBuyNumber: 0,

				tabIndex: 0,
				userId: '', // 当前登录用户的id
				userName: '', // 当前登录用户的姓名

				// 通过分享打开页面
				promotionId: '',
			}
		},
		onLoad(option) {
			this.ticketId = option.ticketId || ''
			this.promotionId = option.promotionId || ''
			
			if (this.promotionId.length > 0) {
				this.setupBindingUserByShare()
			} else {
				this.getUserInfo()
			}

			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				//设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
				menus: ["shareAppMessage", "shareTimeline"]
			})
			// #endif
		},
		onShareAppMessage(res) {
			var that = this
			console.log('onShareAppMessage', res);
			let imageUrl = app.globalData.shareImageUrl //'/static/logo180180.png'
			let showImgUrl = this.getImgView(that.ticketInfo.showImgUrl)
			return {
				title: (that.userName || '您的好友') + '分享了《' + that.ticketInfo.showName + '》，快来看看吧',
				// desc: '票据详情好友',
				imageUrl: showImgUrl,
				path: "/pages/home/ticketDetail/ticketDetail" + '?ticketId=' + this.ticketId + '&promotionId=' + this.userId,
				success: (res) => {
					console.log("success:" + JSON.stringify(res));
				},
				fail: (err) => {
					console.log("fail:" + JSON.stringify(err));
				}
			}
		},
		//分享到朋友圈
		onShareTimeline(res) {
			var that = this
			console.log('onShareAppMessage', res);
			let imageUrl = app.globalData.shareImageUrl //'/static/logo180180.png'
			let showImgUrl = this.getImgView(that.ticketInfo.showImgUrl)
			return {
				title: (that.userName || '您的好友') + '分享了《' + that.ticketInfo.showName + '》，快来看看吧',
				// desc: '票据详情朋友圈',
				imageUrl: showImgUrl,
				path: "/pages/home/ticketDetail/ticketDetail" + '?ticketId=' + this.ticketId + '&promotionId=' + this.userId,
				success: (res) => {
					console.log("success:" + JSON.stringify(res));
				},
				fail: (err) => {
					console.log("fail:" + JSON.stringify(err));
				}
			}
		},
		methods: {
			getImgView(url) {
				return utils.getImgView(url)
			},
			getTicketInfo() {
				let that = this
				this.$api.requestTicketDetailInfo({
					id: this.ticketId
				}).then(res => {
					that.ticketInfo = res.data.result || {}
					that.ticketTotalNumber = that.ticketInfo.showRepertory || 0
					if (that.ticketTotalNumber == 0) {
						setTimeout(() => {
							utils.showToastNoIcon('演出票已售完')
						}, 500)
					}
					that.ticketCurrentNumber = that.ticketTotalNumber
				})

			},
			getUserInfo() {
				let that = this
				this.$api.requestUserInfoByOpenId({
					weChatOpenid: app.globalData.openid
				}).then(res => {
					that.userId = res.data.result && res.data.result.id
					that.userName = res.data.result && res.data.result.weChatName
					that.getTicketInfo()
				}).catch(() => {
					that.getTicketInfo()
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
							scale: 18,
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

			// 选择票数
			reduceClick() {
				if (this.ticketBuyNumber == 0) {
					return
				}
				this.ticketBuyNumber--
				this.ticketCurrentNumber = this.ticketTotalNumber - this.ticketBuyNumber
			},
			plusClick() {
				if (this.ticketBuyNumber == this.ticketTotalNumber) {
					return
				}
				this.ticketBuyNumber++
				this.ticketCurrentNumber = this.ticketTotalNumber - this.ticketBuyNumber
			},
			ticketTabClick(e) {
				this.tabIndex = e
			},

			// 立即购买
			buyTicketClick() {
				if (this.ticketTotalNumber == 0) {
					utils.showToastNoIcon('演出票已售完')
					return
				}
				if (this.ticketBuyNumber == 0) {
					utils.showToastNoIcon('请选择购票数量')
					return
				}
				uni.navigateTo({
					url: '/pages/home/orderConfirm/orderConfirm?ticketId=' + this.ticketId + '&ticketNumber=' + this.ticketBuyNumber
				})
			},

			// 通过分享打开该页面，绑定用户关系
			setupBindingUserByShare() {
				// #ifdef MP-WEIXIN
				let that = this
				uni.login({
					provider: 'weixin',
					success(res) {
						let code = res.code
						that.$api.requestOpenIdByCode({
							code: code
						}).then(res => {
							let openid = res.data.result
							app.globalData.openid = openid
							that.$api.requestWeChatLoginByOpenId({
								weChatOpenid: openid
							}).then(response => {
								app.globalData.token = response.data.result && response.data.result.token
								uni.setStorageSync('userToken', app.globalData.token)
								that.getUserInfo()
								that.$api.requestUpdateWechatUserInfo({
									weChatOpenid: openid,
									pid: that.promotionId
								}).then(res => {
									// uni.showModal({
									// 	title: '通过分享绑定用户关系成功',
									// 	content: '分销码：' + that.promotionId + ';  openid:' + openid
									// })
								})
							})
						})
					}
				})
				// #endif
			}
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
					color: #333333;
					width: 200rpx;
					height: 100rpx;
					line-height: 92rpx;
					text-align: center;
					display: flex;
					flex-direction: column;
					align-items: center;

					.sub_bottom_line {
						display: none;
					}
				}

				.ticket_tab_item.selected {
					font-weight: bold;

					.sub_bottom_line {
						display: inline;
						width: 40%;
						height: 8rpx;
						background-color: #F7C642;
					}
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
			padding: 20rpx 20rpx 20rpx 50rpx;
			box-sizing: border-box;
			background-color: white;

			.bottom_left {
				text-align: center;
				font-size: 26rpx;
				color: #333333;

				image {
					width: 40rpx;
					height: 40rpx;
					margin-right: 20rpx;
				}

				.share_btn {
					width: 200rpx;
					height: 80rpx;
					// line-height: 80rpx;
					font-size: 28rpx;
					color: #333333;
					text-align: center;
					border: none;
					background-color: white;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}

			.bottom_right {
				width: 60%;
				height: 90rpx;
				line-height: 90rpx;
				border-radius: 45rpx;
				background-color: #F7C642;
				text-align: center;
				font-size: 36rpx;
				text-align: center;
			}
		}
	}
</style>

<style>
	button {
		border-radius: 0;
		border: none;
	}

	button::after {
		border: none;
	}
</style>
