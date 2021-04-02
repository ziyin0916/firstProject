<template>
	<view class="search_content">
		<view class='top'>
			<view class='top_search'>
				<input v-model="searchText" placeholder="输入关键词进行搜索" style="font-size: 28rpx; width: 100%;" auto-focus auto-blur
				 confirm-type="search" placeholder-style="fontSize:28rpx" :confirm-type="'search'" @focus="searchFocus" @confirm="onSearchConfirm"
				 @input="searchInput"/>
				<view class="search_btn_view" @click="onSearchConfirm">
					<image src="/static/home/home_search.png"></image>
				</view>
			</view>
		</view>
		<view>
			<mescroll-uni :down="downOption" :up="upOption" @up="upCallback" @down="downCallback" @init="mescrollInit" top="80">
				<view style="padding: 0 20rpx; box-sizing: border-box;">
					<view v-for="(item, index) in searchList" :key="index" class="bottom_section_item" @click="ticketItemClick(item)">
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
			</mescroll-uni>
		</view>
		<view v-if="showHistory" class="search_history_view">
			<view class="search_title">
				<view>历史搜索</view>
				<image src="/static/home/search_remove.png" @click="clearHistory"></image>
			</view>
			<view class="search_history">
				<view v-for="(item, index) in searchHistoryList" :key="index" :class="item.length > 6 ? 'history_long_item' : 'history_item'" @click="historyItemClick(index, item)">
					<view>{{item}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	import utils from '@/utils/utils.js'
	export default {
		components: {
			MescrollUni
		},
		data() {
			return {
				// 下拉刷新的常用配置
				downOption: {},
				// 上拉加载的常用配置
				upOption: {
					page: {
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 3, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '搜索不到相关结果',
						tipDesc: '换个关键词试试吧~',
						icon: require('../../../static/home/search_none.png')
					},
					textNoMore: '----------  没有更多数据啦  ----------'
				},
				mescroll: null,
				searchText: '',
				searchList: [],

				showHistory: true,
				searchHistoryList: []
			}
		},
		onLoad() {
			this.setupSearchHistory()
		},
		methods: {
			getImgView(url) {
				return utils.getImgView(url)
			},
			// 处理搜索历史记录
			setupSearchHistory() {
				let history = uni.getStorageSync('searchHistory') || []
				this.searchHistoryList = history
			},
			clearHistory() {                                                                                            
				this.searchHistoryList = []
				uni.removeStorageSync('searchHistory')
			},
			saveHistory() {
				uni.setStorageSync('searchHistory', this.searchHistoryList)
			},
			historyItemClick(index, item) {
				console.log(index, item);
				if (index < this.searchHistoryList.length) {
					this.searchHistoryList.splice(index, 1)
				}
				this.searchHistoryList.unshift(item)
				this.searchText = item
				this.showHistory = false
				
				this.downCallback(this.mescroll)
			},
			
			// 处理搜索功能
			onSearchConfirm() {
				if (this.searchText.length > 0) {
					let tmpIndex = this.searchHistoryList.indexOf(this.searchText)
					if (tmpIndex != -1) {
						this.searchHistoryList.splice(tmpIndex, 1)
					}
					this.searchHistoryList.unshift(this.searchText)
					if (this.searchHistoryList.length > 6) {
						this.searchHistoryList.pop()
					}
				}
				this.showHistory = false
				uni.setStorageSync('searchHistory', this.searchHistoryList)
				this.mescroll.resetUpScroll()
			},
			searchFocus() {
				this.showHistory = true
			},
			searchInput() {
				if (this.searchHistoryList.length > 0) {
					this.showHistory = true
				}
			},

			// 获取列表数据
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			downCallback(mescroll) {
				this.mescroll.resetUpScroll()
			},
			upCallback(mescroll) {
				this.requestData(mescroll.num, mescroll.size, (curPageData) => {
					mescroll.endSuccess(curPageData.length);
					if (this.mescroll.num == 1) this.searchList = []; //如果是第一页需手动制空列表
					this.searchList = this.searchList.concat(curPageData);
				}, () => {
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				})
			},
			requestData(pageNum, pageSize, successCallback, errorCallback) {
				this.$api.requestSearchTicketList({
					pageNo: pageNum,
					pageSize: pageSize,
					showName: this.searchText,
				}).then(res => {
					let result = res.data.result.records || []
					successCallback && successCallback(result)
				}).catch(err => {
					errorCallback && errorCallback()
				})	
			},
			
			// 购票
			ticketItemClick(item) {
				uni.navigateTo({
					url: '/pages/home/ticketDetail/ticketDetail?ticketId=' + item.id
				})
			}
		}
	}
</script>

<style lang="less">
	.search_content {
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

				view {
					font-size: 28rpx;
					color: #999;
					line-height: 60rpx;
					text-align: center;
				}

				.search_btn_view {
					width: 50rpx;
					height: 50rpx;

					image {
						width: 50rpx;
						height: 50rpx;
					}
				}
			}
		}
	}

	.search_history_view {
		background-color: white;
		position: fixed;
		/* #ifdef H5 */
		top: calc(var(--status-bar-height) + 148rpx);
		/* #endif */
		/* #ifndef H5 */
		top: 80rpx;
		/* #endif */
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		padding: 20rpx;
		box-sizing: border-box;

		.search_title {
			width: 100%;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			view {
				font-size: 32rpx;
				font-weight: bold;
				color: #787878;
				line-height: 80rpx;
			}

			image {
				width: 40rpx;
				height: 40rpx;
			}
		}

		.search_history {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;

			.history_item {
				width: 33%;
				height: 80rpx;
				padding: 10rpx 20rpx;
				box-sizing: border-box;

				view {
					width: 100%;
					height: 100%;
					background-color: #F5F5F5;
					border-radius: 30rpx;
					font-size: 28rpx;
					line-height: 60rpx;
					text-align: center;
				}
			}
			
			.history_long_item {
				width: 100%;
				min-height: 80rpx;
				padding: 10rpx 20rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				align-items: center;
				view {
					width: 100%;
					// height: 100%;
					background-color: #F5F5F5;
					border-radius: 30rpx;
					font-size: 28rpx;
					line-height: 60rpx;
					padding: 0 30rpx;
					box-sizing: border-box;
				}
			}
		}
	}

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
</style>
