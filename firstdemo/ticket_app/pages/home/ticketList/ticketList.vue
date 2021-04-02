<template>
	<view>
		<mescroll-uni :down="downOption" :up="upOption" @up="upCallback" @down="downCallback" @init="mescrollInit" top="0">
			<view style="padding: 0 20rpx; box-sizing: border-box;">
				<view v-for="(item, index) in dataList" :key="index" class="bottom_section_item" @click="ticketItemClick(item)">
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
</template>

<script>
	import utils from '@/utils/utils.js'
	export default {
		data() {
			return {
				promotionName: '',
				promotionCode: '',
				// 下拉刷新的常用配置
				downOption: {},
				// 上拉加载的常用配置
				upOption: {
					page: {
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 3, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无演出',
						icon: require('../../../static/home/ticket_list_none.png')
					},
					textNoMore: '----------  没有更多数据啦  ----------'
				},
				mescroll: null,
				dataList: [],
			}
		},
		onReady() {
			console.log('this.promotionName', this.promotionName);
			uni.setNavigationBarTitle({
				title: this.promotionName
			})
		},
		onLoad(option) {
			console.log('onLoad', option);
			this.promotionName = option.promotionName || ''
			this.promotionCode = option.promotionCode || ''
		},
		methods: {
			getImgView(url) {
				return utils.getImgView(url)
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
					if (this.mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
					this.dataList = this.dataList.concat(curPageData);
				}, () => {
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				})
			},
			requestData(pageNum, pageSize, successCallback, errorCallback) {
				// let result = [{
				// 	img: require('../../../static/temp/home1.png'),
				// 	name: '少林寺',
				// 	place: '国际会展中心',
				// 	time: '随到随看',
				// 	address: '河南省郑州市金水区国基路1号',
				// 	price: '99'
				// }];
				// console.log('requestData');
				
				this.$api.requestTicketList({
					pageNo: pageNum,
					pageSize: pageSize,
					promotionCode: this.promotionCode
				}).then(res => {
					console.log('requestTicketList', res)
					let result = res.data.result || []
					let child = []
					if (result.length > 0) {
						child = result[0].child || []
					}
					successCallback && successCallback(child)
				}).catch(err => {
					errorCallback && errorCallback()
				})				
				
			},
			ticketItemClick(item) {
				uni.navigateTo({
					url:'../ticketDetail/ticketDetail?ticketId=' + item.id
				})
			}
		}
	}
</script>

<style lang="less">
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
