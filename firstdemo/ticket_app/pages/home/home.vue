<template>
	<view class="home_content">
		<!-- <scroll-view scroll-y="true" class="home_view"> -->
		<!-- 顶部搜索 -->
		<view class='top'>
			<view class='top_search' @click='searchClick'>
				<view>请输入搜索关键词</view>
				<image src="/static/home/home_search.png"></image>
			</view>
		</view>
		<!-- 轮播图 -->
		<view class="home_banner">
			<swiper indicator-dots="true" indicator-color="rgba(255, 255, 255, 1)" indicator-active-color="rgba(247, 111, 34, 1)"
			 style="width:100%;height: 100%;" autoplay="true" :circular="true" interval="3000" duration="1000" :current="indexCurrent"
			 @change="swiperChange">
				<swiper-item v-for="(bannerItem,index) in bannerList" :key='index' @click="bannerItemClick(bannerItem)">
					<view class="swiper_item_view">
						<image :src="getImgView(bannerItem.imgUrl)" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view>
			<view v-for="(child, index1) in homeTicketList" :key="index1">
				<view>
					<!-- 精彩演出 -->
					<view style="margin-top: 20rpx;" v-if="index1 == 0">
						<view class="home_section">
							<view class="section_title">{{child.promotionName}}</view>
							<view class="section_right" @click="moreClick(child)">
								<view>更多</view>
								<image src="/static/home/to_right.png"></image>
							</view>
						</view>
						<scroll-view scroll-x="true" class="middle_scroll_view">
							<view class="section_view" :style="{width: sectionWidth + 'rpx'}">
								<view v-for="(item, index) in child.child" :key="index" class="section_view_item" @click="ticketClick(item)">
									<image :src="getImgView(item.showImgUrl)" mode="aspectFill"></image>
									<view>{{item.showName}}</view>
								</view>
							</view>
						</scroll-view>
					</view>
					<view v-else>
						<!-- 所有演出 -->
						<view style="margin-top: 20rpx;">
							<view class="home_section">
								<view class="section_title">{{child.promotionName}}</view>
								<view class="section_right" @click="moreClick(child)">
									<view>更多</view>
									<image src="/static/home/to_right.png"></image>
								</view>
							</view>
							<view class="bottom_section">
								<view v-for="(item, index) in child.child" :key="index" class="bottom_section_item" @click="ticketClick(item)">
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
											<view class="price_view">￥{{item.showFares}}</view>
											<view class="buy_view">购票</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- </scroll-view> -->
	</view>
</template>

<script>
	const app = getApp()
	import utils from '@/utils/utils.js'
	export default {
		data() {
			return {
				// 轮播图
				indexCurrent: 0,
				bannerList: [],

				homeTicketList: [],

				firstSectionList: [],
				sectionWidth: 0,

				bottomList: [],
			}
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
		onShow() {
			this.getTicketList()
			this.getHomeAdvertisingList()
			this.updateTokenIfNeed()
		},
		onShareAppMessage(res) {
			var that = this
			let imageUrl = "/pages/home/home"
			return {
				title: '票务系统，生活因为有我更便捷，快来看看吧',
				// desc: '票据详情好友',
				imageUrl: imageUrl,
				path: "/pages/home/home",
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
			let imageUrl = "/pages/home/home"
			return {
				title: '票务系统，生活因为有我更便捷，快来看看吧',
				// desc: '票据详情朋友圈',
				imageUrl: imageUrl,
				path: "/pages/home/home",
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
			getHomeAdvertisingList() {
				let that = this
				this.$api.requestHomeAdvertisingList({
					isEnable: 'Y'
				}).then(res => {
					let result = res.data.result || {}
					that.bannerList = result.records || []
				})
			},
			getTicketList() {
				let that = this
				this.$api.requestHomeTicketList().then(res => {
					let result = res.data.result || []
					if (result.length > 0) {
						that.firstSectionList = result[0].child || []
						that.sectionWidth = that.firstSectionList.length * 220
					}
					if (result.length > 1) {
						that.bottomList = result[1].child || []
					}
					that.homeTicketList = result
				})
			},

			searchClick() {
				uni.navigateTo({
					url: 'search/search'
				})
			},
			swiperChange(e) {
				this.indexCurrent = e.detail.current;
			},
			bannerItemClick(item) {
				let path = item.gotoUrl || ''
				if (path.length > 0) {
					uni.navigateTo({
						url: 'webView/webView?url=' + path
					})
				}
			},
 
			moreClick(item) {
				console.log('item', item);
				uni.navigateTo({
					url: 'ticketList/ticketList?promotionCode=' + item.promotionCode + '&promotionName=' + item.promotionName
				})
			},
			ticketClick(item) {
				uni.navigateTo({
					url: 'ticketDetail/ticketDetail?ticketId=' + item.id
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
	.home_content {
		width: 100%;
		height: 100%;
		position: relative;
		padding: 10rpx 20rpx;
		box-sizing: border-box;

		.top {
			height: 80rpx;
			width: 100%;

			.top_search {
				width: 100%;
				height: 60rpx;
				border-radius: 30rpx;
				background-color: #EEEEEE;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 30rpx;
				box-sizing: border-box;

				image {
					width: 50rpx;
					height: 50rpx;
				}

				view {
					font-size: 28rpx;
					color: #999;
					line-height: 60rpx;
					text-align: center;

				}
			}
		}

		.home_banner {
			width: 100%;
			height: 375rpx;
			border-radius: 16rpx;
			overflow: hidden;

			.swiper_item_view {
				width: 100%;
				height: 100%;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.home_section {
			width: 100%;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.section_title {
				font-size: 32rpx;
				color: black;
				font-weight: bold;
			}

			.section_right {
				display: flex;
				align-items: center;

				view {
					font-size: 24rpx;
					color: #787878;
				}

				image {
					width: 30rpx;
					height: 30rpx;
				}
			}
		}

		.middle_scroll_view {
			width: 100%;
			height: 330rpx;

			.section_view {
				height: 100%;
				display: flex;

				.section_view_item {
					width: 270rpx;
					height: 100%;
					padding: 0 10rpx;
					box-sizing: border-box;

					image {
						width: 100%;
						height: calc(100% - 50rpx);
					}

					view {
						height: 50rpx;
						line-height: 50rpx;
						width: 100%;
						font-size: 30rpx;
						color: #333333;
						text-align: center;
					}
				}
			}
		}

		.bottom_section {
			padding: 20rpx 0;
			box-sizing: border-box;

			.bottom_section_item {
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
						margin-top: 10rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;

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
	}

	.home_view {
		width: 100%;
		height: 100%;
	}
</style>
<style>
	/* #ifdef MP-WEIXIN || APP-PLUS */
	::-webkit-scrollbar {
		display: none;
	}

	/* #endif */
</style>
