<template>
	<view class="mine_view">
		<view class="user_view" @click="userInfoClick">
			<image :src="isLogin ? getImgView(avatarUrl) : '../../static/mine/default_header.png'"></image>
			<view v-if="isLogin" class="user_name">
				<view>{{nickName}}</view>
				<view class="phone">{{phoneNumberSecretFormat(phoneNumber)}}</view>
			</view>
			<view class="user_name" v-else>立即登录</view>
		</view>
		<view class="mine_content">
			<view class="mine_section" v-if="isLogin">
				<view class="title">
					<view>待使用的票</view>
				</view>
				<view class="ticket">
					<view v-for="(item, index) in myTicketList" :key="index" class="ticket_item" :style="index < myTicketList.length - 1 ? 'border-bottom: 2rpx #F4F4F4 dashed;' : ''"
					 @click="ticketClick(item)">
						<image :src="getImgView(item.showImgUrl)" mode="aspectFill"></image>
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
							<view class="item_bottom">
								<view></view>
								<view class="buy_view">去使用</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="mine_section">
				<view class="title">
					<view>我的订单</view>
					<view class="more" @click="myOrderClick(0)">
						<view>查看全部订单</view>
						<image src="/static/home/to_right.png"></image>
					</view>
				</view>
				<view class="mine_order">
					<view class="order_item" @click="myOrderClick(1)">
						<image src="/static/mine/mine_order_wait_use.png"></image>
						<view>待使用</view>
					</view>
					<view class="order_item" @click="myOrderClick(2)">
						<image src="/static/mine/mine_order_finished.png"></image>
						<view>已完成</view>
					</view>
				</view>
			</view>
			<view class="mine_section">
				<view class="title">
					<view>我的分销</view>
				</view>
				<view class="mine_order" v-if="isLogin && isDistributer">
					<view class="order_item" @click="myDistributerCodeClick">
						<image src="/static/mine/mine_dis_code.png"></image>
						<view>我的分销码</view>
					</view>
					<view class="order_item" @click="myPerformanceClick">
						<image src="/static/mine/mine_dis_amount.png"></image>
						<view>我的业绩</view>
					</view>
				</view>
				<view class="mine_order" v-else>
					<view class="order_item" @click="applyDistributionClick">
						<image src="/static/mine/mine_dis_apply.png"></image>
						<view>分销申请</view>
					</view>
				</view>
			</view>
			<view class="mine_section" v-if="isLogin && isAdmin">
				<view class="mine_order">
					<view class="order_item" @click="porterClick">
						<image src="/static/mine/mine_admin.png"></image>
						<view>我是验票员</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	import utils from '@/utils/utils.js'
	export default {
		data() {
			return {
				isLogin: false, // 是否登录
				isDistributer: false, // 是否是分销员
				isAdmin: true, // 是否是验票员
				isDistributerInReview: false, // 分销申请审核中

				avatarUrl: '', // 头像
				nickName: '', // 昵称
				phoneNumber: '', // 手机号

				myTicketList: [], // 票据列表
			}
		},
		onReady() {
			uni.setNavigationBarColor({
				frontColor: '#000000',
				backgroundColor: '#F7C642'
			})
		},
		onShow() {
			this.getUserInfo()
			this.updateTokenIfNeed()
		},
		onLoad() {
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
			let imageUrl = "/pages/mine/mine"
			return {
				title: '票务系统，生活因为有我更便捷，快来看看吧',
				// desc: '票据详情好友',
				imageUrl: imageUrl,
				path: "/pages/mine/mine",
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
			let imageUrl = "/pages/mine/mine"
			return {
				title: '票务系统，生活因为有我更便捷，快来看看吧',
				// desc: '票据详情朋友圈',
				imageUrl:imageUrl,
				path: "/pages/mine/mine",
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
			phoneNumberSecretFormat(phoneNumber) {
				return utils.phoneNumberSecretFormat(phoneNumber)
			},
			getUserInfo() {
				let that = this
				this.$api.requestUserInfoByOpenId({
					weChatOpenid: app.globalData.openid
				}).then(res => {
					console.log('requestUserInfoByOpenId', res);
					let result = res.data.result || {}
					if (result.phone && result.phone.length > 0) {
						that.isLogin = true
						that.phoneNumber = result.phone
						that.getUserNickname()
						that.getUnusedTicket()
					} else {
						that.isLogin = false
						that.phoneNumber = ''
						that.nickName = ''
					}
					// auditStatus null: 普通人员 10:分销人员审核中； 20:分销人员审核通过；
					if (result.auditStatus == 10) {
						that.isDistributer = false
						that.isDistributerInReview = true
					} else if (result.auditStatus == 20) {
						that.isDistributer = true
						that.isDistributerInReview = false
					} else {
						that.isDistributer = false
						that.isDistributerInReview = false
					}

					if (result.userType == 1) {
						that.isAdmin = true
					} else {
						that.isAdmin = false
					}
				})
			},

			getUnusedTicket() {
				let that = this
				this.$api.requestMineUnusedTicketList({
					pageNo: 1,
					pageSize: 100,
					ticketState: 1
				}).then(res => {
					that.myTicketList = res.data.result.records || []
				})
			},

			getUserNickname() {
				// #ifdef MP-WEIXIN
				let that = this
				uni.getSetting({
					success: (res) => {
						if (res.authSetting['scope.userInfo']) {
							// 已经授权，可以直接调用 getUserInfo 获取头像昵称
							uni.getUserInfo({
								provider: 'weixin',
								lang: 'zh_CN',
								success: (res) => {
									let userInfo = res.userInfo || {}
									that.nickName = userInfo.nickName
									that.avatarUrl = userInfo.avatarUrl
									that.$api.requestUpdateWechatUserInfo({
										weChatOpenid: app.globalData.openid,
										weChatName: that.nickName,
										weChatUrl: that.avatarUrl
									}).then(() => {})
								},
								fail: (err) => {
									console.log('getUserInfo:fail', err);
								},
							})
						}
					}
				})
				// #endif
			},

			// 票据详情
			ticketClick(item) {
				uni.navigateTo({
					url: 'ticketDetailInfo/ticketDetailInfo?id=' + item.id
				})
			},
			// 我的订单
			myOrderClick(type) {
				console.log('myOrderClick', type);
				if (!this.isLogin) {
					uni.navigateTo({
						url: 'authorization/authorization'
					})
					return
				}
				uni.navigateTo({
					url: 'orderList/orderList?type=' + type
				})
			},
			// 用户授权登录
			userInfoClick() {
				if (this.isLogin) {
					return
				}
				uni.navigateTo({
					url: 'authorization/authorization'
				})
			},
			// 分销申请
			applyDistributionClick() {
				if (!this.isLogin) {
					uni.navigateTo({
						url: 'authorization/authorization'
					})
					return
				}
				if (this.isDistributerInReview) {
					utils.showToastNoIcon('分销申请审核中...')
					return
				}
				uni.navigateTo({
					url: 'applyDistribution/applyDistribution?phone=' + this.phoneNumber
				})
			},
			// 我的分销码
			myDistributerCodeClick() {
				uni.navigateTo({
					url: 'myDistributerCode/myDistributerCode'
				})
			},
			// 我的业绩
			myPerformanceClick() {
				uni.navigateTo({
					url: 'myPerformance/myPerformance'
				})
			},
			// 我是验票员
			porterClick() {
				uni.navigateTo({
					url: 'checkTicket/checkTicket'
				})
			},
			
			updateTokenIfNeed() {
				let that = this
				if (app.globalData.token.length > 0) {
					return
				}
				// #ifdef MP-WEIXIN
				uni.login({
					provider: 'weixin',
					success(res) {
						let code = res.code
						that.$api.requestOpenIdByCode({
							code: code
						}).then(res => {
							app.globalData.openid = res.data.result
							that.$api.requestWeChatLoginByOpenId({
								weChatOpenid: app.globalData.openid
							}).then(response => {
								app.globalData.token = response.data.result && response.data.result.token
								uni.setStorageSync('userToken', app.globalData.token)
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
		background-color: #F4F4F4;
	}

	.mine_view {
		width: 100%;
		height: 100%;

		.user_view {
			width: 100%;
			height: 180rpx;
			background-color: #F7C642;
			display: flex;
			padding: 30rpx;
			box-sizing: border-box;
			align-items: center;

			image {
				width: 120rpx;
				height: 120rpx;
				border-radius: 60rpx;
			}

			.user_name {
				margin-left: 30rpx;
				font-size: 30rpx;
				font-weight: bold;
				line-height: 50rpx;

				.phone {
					font-size: 24rpx;
					font-weight: normal;
				}
			}
		}

		.mine_content {
			padding: 0 20rpx 20rpx;
			box-sizing: border-box;

			.mine_section {
				width: 100%;
				padding: 0 20rpx;
				margin-top: 20rpx;
				border-radius: 10rpx;
				box-sizing: border-box;
				background-color: white;

				.title {
					width: 100%;
					height: 80rpx;
					line-height: 80rpx;
					font-size: 32rpx;
					font-weight: bold;
					border-bottom: 2rpx #F4F4F4 solid;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.more {
						display: flex;
						align-items: center;
						font-size: 28rpx;
						line-height: 30rpx;
						color: #999999;
						font-weight: normal;

						image {
							width: 30rpx;
							height: 30rpx;
						}
					}
				}

				.ticket {
					.ticket_item {
						width: 100%;
						min-height: 320rpx;
						padding: 15rpx 0;
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

								.price_view {
									font-size: 32rpx;
									font-weight: bold;
									color: #FE2536;
									line-height: 50rpx;
								}

								.buy_view {
									width: 120rpx;
									height: 50rpx;
									line-height: 50rpx;
									border-radius: 8rpx;
									background-color: #F7C642;
									color: #000000;
									font-size: 26rpx;
									text-align: center;
								}

							}
						}
					}
				}

				.mine_order {
					width: 100%;
					height: 160rpx;
					display: flex;
					align-items: center;
					padding: 10rpx 0;
					box-sizing: border-box;

					.order_item {
						width: 160rpx;
						height: 100%;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: space-evenly;

						image {
							width: 40rpx;
							height: 40rpx;
						}

						view {
							font-size: 28rpx;
							color: #333333;
						}
					}
				}
			}
		}
	}
</style>
