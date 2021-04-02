<template>
	<view>
		<!-- segment -->
		<view class="segment_view">
			<view :class="index == segmentIndex ? 'segment_item on' : 'segment_item'" v-for="(item,index) in segmentList" :key="index"
			 @click="changeType(index)">
				{{item}}
			</view>
		</view>
		<mescroll-uni :down="downOption" :up="upOption" @up="upCallback" @down="downCallback" @init="mescrollInit" @emptyclick="emptyClick" top="92">
			<view v-for="(item, index) in dataList" :key="index" class="order" :style="index < dataList.length - 1 ? 'border-bottom: 2rpx #F4F4F4 dashed;' : ''"
			 @click="orderClick(item)">
				<view class="order_title">
					<view class="order_number">订单编号:{{item.orderNo}}</view>
					<view class="order_status">{{item.orderState == 1 ? '待使用' : '已完成'}}</view>
				</view>
				<view class="order_item">
					<image :src="getImgView(item.showImgUrl)" mode="aspectFill"></image>
					<view class="right_view">
						<view class="item_title">{{item.showName}}</view>
						<view class="item_content">
							<image src="/static/home/home_place.png"></image>
							<view>{{item.venueName}}</view>
						</view>
						<view class="item_content">
							<image src="/static/home/home_time.png"></image>
							<view>{{item.showTime || '--'}}</view>
						</view>
						<view class="item_content">
							<image src="/static/home/home_address.png"></image>
							<view>{{item.showCriName || ''}}{{item.showSite || ''}}</view>
						</view>
						<view class="item_bottom">
							<view class="number_view">￥{{item.showFares}}<span>x{{item.showNumber}}</span></view>
							<view class="price_view">总价：<span>￥{{item.orderMoney}} </span></view>
						</view>
					</view>
				</view>
				<view class="order_option_view" v-if="item.orderState == 1">
					<view class="option_btn_left" @click.stop="applyOrderRefund(item)">申请退款</view>
					<view class="option_btn_right">查看订单</view>
				</view>
				<view class="order_option_view" v-else>
					<view class="option_btn_left" @click.stop="orderDelete(item)">删除订单</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import utils from '@/utils/utils.js'
	import myconfig from '@/common/http/config.js'
	export default {
		data() {
			return {
				segmentIndex: 0,
				segmentList: ['全部', '待使用', '已完成'],

				// 下拉刷新的常用配置
				downOption: {},
				// 上拉加载的常用配置
				upOption: {
					page: {
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 3, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无订单',
						tipDesc: '请您先去预订喜欢的演出吧~',
						icon: require('../../../static/mine/order_none.png'),
						btnText: '立即下单'
					},
					textNoMore: '----------  没有更多数据啦  ----------'
				},
				mescroll: null,
				dataList: [],
			}
		},
		onLoad(option) {
			let type = option.type || '0'
			this.segmentIndex = parseInt(type)
		},
		onShow() {
			if (this.mescroll) {
				this.mescroll.resetUpScroll()
			}
		},
		methods: {
			getImgView(url) {
				return utils.getImgView(url)
			},
			changeType(index) {
				this.segmentIndex = index
				this.mescroll.resetUpScroll()
			},
			
			emptyClick() {
				console.log('emptyClick');
				uni.switchTab({
					url: '/pages/home/home'
				})
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
				this.$api.requestOrderList({
					pageNo: pageNum,
					pageSize: pageSize,
					type: 2,
					orderState: this.segmentIndex > 0 ? this.segmentIndex : ''
				}).then(res => {
					let result = res.data.result.records || []
					successCallback && successCallback(result)
				}).catch(err => {
					errorCallback && errorCallback()
				})	
			},
		
			
			orderClick(item) {
				uni.navigateTo({
					url: '/pages/mine/orderDetail/orderDetail?orderId=' + item.id
				})
			},
			applyOrderRefund(item) {
				console.log('申请退款');
				uni.navigateTo({
					url: '/pages/mine/applyRefund/applyRefund?orderId=' + item.id 
				})
			},
			orderDelete(item) {
				console.log('删除项目');
				let that = this
				uni.showModal({
					title: '您确定删除该订单吗?',
					success(res) {
						console.log(res);
						if (res.confirm) {
							that.$api.requestOrderDelete({
								id: item.id
							}).then(res => {
								utils.showToastNoIcon('删除成功')
								that.mescroll.resetUpScroll()
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F5F5F5;
	}

	/*头部导航*/
	.segment_view {
		//父布局
		width: 100%;
		height: 92rpx;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		border-top: #EEEEEE solid 2rpx;
		padding: 10rpx 30rpx 10rpx;
		box-sizing: border-box;

		.segment_item {
			height: 70rpx;
			line-height: 70rpx;
			font-size: 28rpx;
			text-align: center;
			font-weight: normal;
			margin: 0 20rpx;
			color: #333333;
		}

		.segment_item.on {
			color: #000000;
			font-size: 32rpx;
			font-weight: bold;
			border-bottom: solid 6rpx #F7C642;
		}
	}

	.order {
		width: 100%;
		background-color: white;
		margin-top: 20rpx;
		padding: 20rpx 30rpx 0;
		box-sizing: border-box;

		.order_title {
			width: 100%;
			height: 50rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 28rpx;
			color: #333333;

			.order_status {
				color: #F7C642;
			}
		}

		.order_item {
			width: 100%;
			min-height: 320rpx;
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
		}

		.order_option_view {
			width: 100%;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			font-size: 26rpx;

			.option_btn_left {
				color: #999999;
				border: #DDDDDD solid 2rpx;
				padding: 10rpx 30rpx;
				box-sizing: border-box;
				border-radius: 8rpx;
			}

			.option_btn_right {
				color: #000000;
				background-color: #F7C642;
				padding: 10rpx 30rpx;
				box-sizing: border-box;
				border-radius: 8rpx;
				margin-left: 30rpx;
			}
		}
	}
</style>
