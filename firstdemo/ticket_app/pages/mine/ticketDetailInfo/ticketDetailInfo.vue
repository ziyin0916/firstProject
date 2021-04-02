<template>
	<view class="ticket_detail_view">
		<view class="ticket_view">
			<view class="ticket_item">
				<image class="left_image" :src="getImgView(ticketInfo.showImgUrl)" mode="aspectFill"></image>
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
					<view class="item_content">
						<image src="/static/home/home_address.png"></image>
						<view>{{ticketInfo.showCriName || ''}}{{ticketInfo.showSite || ''}}</view>
					</view>
				</view>
				<!-- <image class="right_image" src="../../../static/mine/ticket_unuse.png"></image> -->
				<image class="right_image" :src="ticketInfo.ticketState == 1 ? '/static/mine/ticket_unuse.png' : ticketInfo.ticketState == 2 ? '/static/mine/ticket_used.png' : ticketInfo.ticketState == 3 ? '/static/mine/ticket_refunding.png' : ticketInfo.ticketState == 4 ? '/static/mine/ticket_refunded.png' : ''"></image>
			</view>
		</view>

		<view class="qr_back_view">
			<view class="ticket_number" :style="isCanShare ? '': 'color: #ccc;'">票据编号：{{ticketInfo.ticketNo || ''}}</view>
			<view class="qr_view">
				<tkiqrcode :val="ticketInfo.ticketNo" :size="300" :unit="'upx'" :onval="true" :loadMake="true" :usingComponents="true"
				 :showLoading="false" :foreground="isCanShare ? '#000': '#ccc'" :pdground="isCanShare ? '#000': '#ccc'" />
			</view>
		</view>
		<view class="share_view" v-if="comeFrom != 'share'" :style="isCanShare ? '': 'color: #ccc;'" @click="shareClick">
			<!-- 微信小程序分享 -->
			<!-- #ifdef MP-WEIXIN -->
			<button class='share_btn' open-type="share" :disabled="!isCanShare">
				<image src="/static/home/share.png"></image>
				分享给朋友
			</button>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<image src="/static/home/share.png"></image>
			<view>分享给朋友</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	var app = getApp()
	import tkiqrcode from '@/components/tki-qrcode/tki-qrcode.vue'
	import utils from '@/utils/utils.js'
	export default {
		components: {
			tkiqrcode
		},
		data() {
			return {
				isCanShare: false,
				ticketInfo: {},
				ticketId: '',

				comeFrom: '',

				userId: '',
				userName: '', // 当前登录用户的姓名
				// 通过分享打开页面
				promotionId: '',
			}
		},
		onLoad(option) {
			this.comeFrom = option.from || '' // share 通过分享打开
			this.ticketId = option.id || ''
			this.promotionId = option.promotionId || ''
			this.getTicketDetailInfo()
			this.getUserInfo()
			if (this.promotionId.length > 0) {
				this.setupBindingUserByShare()
			}
		},

		onShareAppMessage(res) {
			var that = this
			console.log('onShareAppMessage', res);
			let imageUrl = getApp().globalData.shareImageUrl //'/static/logo180180.png'
			let showImgUrl = this.getImgView(that.ticketInfo.showImgUrl)
			return {
				title: (that.userName || '') + '分享了《' + that.ticketInfo.showName + '》的演出票，快去使用吧',
				// desc: '票据详情好友',
				imageUrl: showImgUrl,
				path: "/pages/mine/ticketDetailInfo/ticketDetailInfo?id=" + this.ticketId + '&from=share' + '&promotionId=' + this.userId,
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
			shareClick() {
				if (this.isCanShare) {
					console.log('shareClick');
				}
			},
			getUserInfo() {
				let that = this
				this.$api.requestUserInfoByOpenId({
					weChatOpenid: app.globalData.openid
				}).then(res => {
					that.userId = res.data.result && res.data.result.id
					that.userName = res.data.result && res.data.result.weChatName
				})
			},
			getTicketDetailInfo() {
				let that = this
				this.$api.requestTicketDetailInOrder({
					id: this.ticketId
				}).then(res => {
					that.ticketInfo = res.data.result || {}
					that.isCanShare = that.ticketInfo.ticketState == 1
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
	page {
		background-color: #F5F5F5;
		width: 100%;
		height: 100%;
	}

	.ticket_detail_view {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.ticket_view {
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

	.qr_back_view {
		width: 100%;
		background-color: white;
		margin-top: 20rpx;
		text-align: center;
		padding: 80rpx 30rpx 80rpx;
		box-sizing: border-box;
		font-size: 32rpx;

		.ticket_number {}

		.qr_view {
			width: 100%;
			margin-top: 60rpx;
		}
	}

	.share_view {
		color: #333333;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100rpx;
		margin-top: 2rpx;

		image {
			width: 40rpx;
			height: 40rpx;
			margin-right: 20rpx;
		}

		.share_btn {
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			font-size: 32rpx;
			text-align: center;
			border: none;
			background-color: white;
			display: flex;
			align-items: center;
			justify-content: center;
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
