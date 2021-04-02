<template>
	<view>
		<!-- <view class="date_back_view">
			<picker mode="date" fields="month" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
				<view class="date_view">
					<view>{{date}}</view>
					<image src="/static/mine/date_down.png"></image>
				</view>
			</picker>
		</view>
		<view class="total_view">
			<view class="total_money">
				<view>{{mouthTotalMoney}}</view>
				<view>本月成交额(元)</view>
			</view>
			<view class="total_count">
				<view>{{mouthTotalCount}}</view>
				<view>(单)</view>
			</view>
		</view>
		<view class="charts_back_view">
			<canvas canvas-id="canvasArea" id="canvasArea" class="charts"></canvas>
		</view>
		<view class="mouth_back_view">
			<view class="performance_view">
				<view>
					<image src="/static/mine/performance.png"></image>
					<view>本月业绩(元)</view>
				</view>
				<view>{{mouthPerformance}}</view>
			</view>
			<view class="commission_view">
				<view>
					<image src="/static/mine/commission.png"></image>
					<view>本月提佣(元)</view>
				</view>
				<view>{{mouthCommission}}</view>
			</view>
		</view> -->
		<!-- <view class="detail_view">
			<view class="detail_title">明细</view>
			<view class="detail_item" v-if="dataSource.length > 0" v-for="(item, index) in dataSource" :key="index">
				<image class="left_image" src="/static/temp/performance1.png"></image>
				<view class="nickname">{{item.nickname}}</view>
				<view class="right">
					<view class="top">
						<image src="/static/mine/performance.png"></image>
						<view>+{{item.performance}}元</view>
					</view>
					<view class="bottom">
						<image src="/static/mine/commission.png"></image>
						<view>+{{item.commission}}元</view>
					</view>
				</view>
			</view>
			<view v-if="dataSource.length == 0" class="detail_no_data">
				------    暂无明细    ------
			</view>
		</view> -->


		<mescroll-uni :down="downOption" :up="upOption" @up="upCallback" @down="downCallback" @init="mescrollInit" top="0">

			<view class="date_back_view">
				<picker mode="date" fields="month" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
					<view class="date_view">
						<view>{{date}}</view>
						<image src="/static/mine/date_down.png"></image>
					</view>
				</picker>
			</view>
			<view class="total_view">
				<view class="total_money">
					<view>{{mouthTotalMoney}}</view>
					<view>本月成交额(元)</view>
				</view>
				<view class="total_count">
					<view>{{mouthTotalCount}}</view>
					<view>(单)</view>
				</view>
			</view>
			<view class="charts_back_view">
				<canvas canvas-id="canvasArea" id="canvasArea" class="charts"></canvas>
			</view>
			<view class="mouth_back_view">
				<view class="performance_view">
					<view>
						<image src="/static/mine/performance.png"></image>
						<view>本月业绩(元)</view>
					</view>
					<view>{{mouthPerformance}}</view>
				</view>
				<view class="commission_view">
					<view>
						<image src="/static/mine/commission.png"></image>
						<view>本月提佣(元)</view>
					</view>
					<view>{{mouthCommission}}</view>
				</view>
			</view>

			<view class="detail_view">
				<view class="detail_title">明细</view>
				<view class="detail_item" v-if="dataSource.length > 0" v-for="(item, index) in dataSource" :key="index">
					<image class="left_image" :src="getImgView(item.we_chat_url)"></image>
					<view class="nickname">{{item.we_chat_name}}</view>
					<view class="right">
						<view class="top">
							<image src="/static/mine/performance.png"></image>
							<view>+{{item.show_fares}}元</view>
						</view>
						<view class="bottom">
							<image src="/static/mine/commission.png"></image>
							<view>+{{item.profit}}元</view>
						</view>
					</view>
				</view>
				<view v-if="dataSource.length == 0" class="detail_no_data">
					------ 暂无明细 ------
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import utils from '@/utils/utils.js'
	import uCharts from '@/components/u-charts/u-charts.js';
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	import moment from 'moment'
	var _self, canvasObj = {};
	export default {
		components: {
			MescrollUni
		},
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				date: currentDate,
				cWidth: '',
				cHeight: '',

				mouthTotalMoney: '', // 本月成交额
				mouthTotalCount: '', // 单数
				mouthPerformance: '', // 本月业绩
				mouthCommission: '', // 本月提佣

				dataSource: [],

				// 下拉刷新的常用配置
				downOption: {},
				// 上拉加载的常用配置
				upOption: {
					page: {
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 3, // 配置列表的总数量要大于等于3条才显示'-- END --'的提示
					empty: {
						onShow: false,
					},
					textNoMore: '----------  没有更多数据啦  ----------'
				},
				mescroll: null,
			}
		},
		computed: {
			startDate() {
				return this.getDate('start')
			},
			endDate() {
				return this.getDate('end')
			}
		},
		onLoad() {
			_self = this;
			this.cWidth = uni.upx2px(682);
			this.cHeight = uni.upx2px(400);

			this.getPerformance()
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
					if (this.mescroll.num == 1) this.dataSource = []; //如果是第一页需手动制空列表
					this.dataSource = this.dataSource.concat(curPageData);
				}, () => {
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				})
			},
			requestData(pageNum, pageSize, successCallback, errorCallback) {
				this.$api.requestMyPerformanceDetailList({
					pageNo: pageNum,
					pageSize: pageSize,
				}).then(res => {
					let result = (res.data.result && res.data.result.page) || []
					successCallback && successCallback(result)
				}).catch(err => {
					errorCallback && errorCallback()
				})
			},


			bindDateChange(e) {
				console.log('bindDateChange', e);
				this.date = e.target.value
				this.getPerformance()
				this.mescroll.resetUpScroll()
			},

			getPerformance() {
				let that = this
				this.$api.requestMyPerformance({
					dateTime: this.date
				}).then(res => {
					let result = res.data.result || {}
					that.mouthTotalMoney = (result.data && result.data.total) || '0'
					that.mouthTotalCount = (result.data && result.data.count) || '0'
					that.mouthPerformance = (result.data && result.data.total) || '0'
					that.mouthCommission = (result.data && result.data.profit) || '0'
					let list = result.list || []
					let categories = []
					let tmpData = []
					list.forEach(ele => {
						categories.push(moment(ele.day).format('MM-DD'))
						tmpData.push(ele.count)
					})

					that.fillData(categories, tmpData)
				})
			},

			fillData(categories, tmpData) {
				let Area = {
					categories,
					series: [{
						"name": "收入统计",
						"data": tmpData,
						"color": "#ffffff"
					}]
				};
				this.showArea("canvasArea", Area);
			},
			showArea(canvasId, chartData) {
				canvasObj[canvasId] = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'area',
					fontSize: 11,
					padding: [0, 18, 10, 5],
					legend: {
						show: true,
						position: 'top',
						float: 'center',
						itemGap: 30,
						padding: 5,
						lineHeight: 18,
						margin: 0,
					},
					dataLabel: false,
					dataPointShape: true,
					background: '#FFFFFF',
					pixelRatio: 1,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					xAxis: {
						fontColor: '#ffffff',
						axisLineColor: '#ffffff',
						disableGrid: true,
						boundaryGap: 'justify' //两端不留白配置
					},
					yAxis: {
						gridType: 'solid',
						gridColor: '#ffffff',
						splitNumber: 5,
						data: [{
							fontColor: '#fff',
							axisLineColor: '#fff'
						}]
					},
					width: _self.cWidth * 1,
					height: _self.cHeight * 1,
					extra: {
						area: {
							type: 'curve',
							opacity: 0.2,
							addLine: true,
							width: 2
						}
					}
				});
			},
			touchIt(e, id) {
				canvasObj[id].touchLegend(e, {
					animation: false
				});
				canvasObj[id].showToolTip(e, {
					format: function(item, category) {
						if (typeof item.data === 'object') {
							return category + ' ' + item.name + ':' + item.data.value
						} else {
							return category + ' ' + item.name + ':' + item.data
						}
					}
				});
			},

			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year;
				}
				month = month > 9 ? month : '0' + month;;
				return `${year}-${month}`;
			}
		}
	}
</script>

<style lang="less">
	page {
		height: 100%;
		background-color: #F5F5F5;
	}

	.date_back_view {
		width: 100%;
		height: 90rpx;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30rpx;
		color: #333333;

		.date_view {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 10rpx 20rpx;
			box-sizing: border-box;
			border: 2rpx #DDDDDD solid;
			border-radius: 10rpx;

			image {
				width: 40rpx;
				height: 40rpx;
				margin-left: 20rpx;
			}
		}
	}

	.total_view {
		width: 100%;
		min-height: 90rpx;
		background-color: white;
		padding: 0 20rpx 20rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 36rpx;
		color: #333333;
		font-weight: bold;

		.total_money :last-child {
			font-size: 28rpx;
			color: #666666;
			font-weight: normal;
		}

		.total_count {
			text-align: right;
		}

		.total_count :last-child {
			font-size: 28rpx;
			color: #666666;
			font-weight: normal;

		}
	}

	.charts_back_view {
		padding: 0 24rpx 24rpx;
		box-sizing: border-box;
		background-color: white;

		.charts {
			width: 100%;
			height: 400rpx;
			border-radius: 8rpx;
			background: linear-gradient(90deg, #3D9FE6 0%, #4880DB 100%);
		}
	}

	.mouth_back_view {
		width: 100%;
		min-height: 120rpx;
		background-color: white;
		margin-top: 20rpx;
		padding: 30rpx;
		box-sizing: border-box;
		font-size: 36rpx;
		color: #333333;
		font-weight: bold;
		display: flex;
		align-items: center;

		.performance_view {
			width: 50%;
			height: 100%;
			text-align: center;
		}

		.performance_view :first-child {
			font-size: 28rpx;
			color: #666666;
			font-weight: normal;
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 30rpx;
				height: 30rpx;
				margin-right: 10rpx;
			}
		}

		.commission_view {
			width: 50%;
			height: 100%;
			text-align: center;
		}

		.commission_view :first-child {
			font-size: 28rpx;
			color: #666666;
			font-weight: normal;
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 30rpx;
				height: 30rpx;
				margin-right: 10rpx;
			}
		}
	}

	.detail_view {
		width: 100%;
		background-color: white;
		margin-top: 20rpx;
		padding-bottom: 5rpx;
		box-sizing: border-box;

		.detail_title {
			width: 100%;
			height: 90rpx;
			padding-left: 20rpx;
			box-sizing: border-box;
			line-height: 90rpx;
			font-size: 32rpx;
			font-weight: bold;
			color: #333333;
			border-bottom: #EEEEEE 2rpx solid;
		}

		.detail_item {
			width: 100%;
			min-height: 120rpx;
			padding: 20rpx;
			box-sizing: border-box;
			border-bottom: #EEEEEE 2rpx solid;
			display: flex;
			align-items: center;

			// justify-content: space-between;
			.left_image {
				width: 80rpx;
				height: 80rpx;
				border-radius: 40rpx;
				margin-right: 20rpx;
			}

			.nickname {
				font-size: 28rpx;
				height: 100%;
				width: calc(100% - 100rpx - 200rpx);
			}

			.right {
				font-size: 26rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 200rpx;
				height: 100%;

				.top {
					width: 100%;
					color: #4581F5;
					display: flex;
					align-items: center;
					justify-content: flex-end;

					image {
						width: 30rpx;
						height: 30rpx;
						margin-right: 10rpx;
					}
				}

				.bottom {
					width: 100%;
					color: #FF433D;
					margin-top: 10rpx;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					margin-top: 10rpx;

					image {
						width: 30rpx;
						height: 30rpx;
						margin-right: 10rpx;
					}
				}
			}
		}

		.detail_no_data {
			width: 100%;
			height: 200rpx;
			background-color: white;
			line-height: 120rpx;
			font-size: 28rpx;
			color: #999999;
			text-align: center;
		}
	}
</style>
