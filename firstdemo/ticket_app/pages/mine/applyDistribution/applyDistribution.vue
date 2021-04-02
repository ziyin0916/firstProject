<template>
	<view>
		<view class="dis_apply_item" @click="chooseChannelClick">
			<view class="apply_title">
				<span>*</span>选择渠道
			</view>
			<view class="apply_content">
				<view v-if="chooseChannel.id">{{chooseChannel.channelName || ''}}</view>
				<input v-else disabled placeholder="请选择渠道" placeholder-style="fontSize: 30rpx"/>
				<image src="../../../static/home/to_right.png"></image>
			</view>
		</view>
		<view class="dis_apply_item">
			<view class="apply_title">
				<span>*</span>申请人姓名
			</view>
			<view class="apply_content">
				<input v-model="userName" placeholder="请输入姓名" placeholder-style="fontSize: 30rpx"/>
			</view>
		</view>
		<view class="dis_apply_item">
			<view class="apply_title">
				<span>*</span>联系电话
			</view>
			<view class="apply_content">
				{{phone}}
				<!-- <input v-model="phone" placeholder="请输入联系电话" placeholder-style="fontSize: 30rpx"/> -->
			</view>
		</view>
		<view class="dis_apply_item">
			<view class="apply_title">
				<span>*</span>所属公司
			</view>
			<view class="apply_content">
				<input v-model="company" placeholder="请输入所属公司" placeholder-style="fontSize: 30rpx"/>
			</view>
		</view>
		
		<view class="submit_view" @click="submitClick">
			<view>提交</view>
		</view>
		
		<view class="mask_view" v-if="showChannelView" @touchmove.stop.prevent="() => {}" @click="closeChannelView">
			<view class="reason_back_view">
				<view class="reason_title">选择渠道</view>
				<view v-for="(item, index) in channelList" :key="index" class="reason_item" @click.stop="channelItemClick(item)">
					<view>{{item.channelName}}</view>
					<image :src="item.id == chooseChannel.id ? '/static/mine/reason_selected.png' : '/static/mine/reason_unselect.png'"></image>
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
				channel: '',
				userName: '',
				phone: '',
				company: '',
				
				showChannelView: false,
				chooseChannel: {},
				
				channelList: [],
				
				showPaySuccessView: false,
				loading: false,
			}
		},
		onLoad(option) {
			this.phone = option.phone || ''
			this.getChannelList()
		},
		methods: {
			getChannelList() {
				let that = this
				this.$api.requestChannelList({
					pageNo: 1,
					pageSize: 100
				}).then(res => {
					that.channelList = res.data.result.records || []
				})
			},
			submitClick() {
				if (!this.chooseChannel.id || this.chooseChannel.id.length == 0) {
					utils.showToastNoIcon('请选择渠道')
					return
				}
				if (this.userName.length == 0) {
					utils.showToastNoIcon('请输入姓名')
					return
				}
				if (this.company.length == 0) {
					utils.showToastNoIcon('请输入所属公司')
					return
				}
				let params = {
					channelId: this.chooseChannel.id,
					userName: this.userName,
					phone: this.phone,
					company: this.company
				}
				let that = this
				if (this.loading) {
					return
				}
				this.loading = true
				this.$api.requestApplyDistribution(params).then(res => {
					that.showPaySuccessView = true
					that.loading = false
				}).catch(err => {
					that.loading = false
				})
			},
			
			chooseChannelClick() {
				this.showChannelView = true
			},
			closeChannelView() {
				this.showChannelView = false
			},
			channelItemClick(item) {
				this.chooseChannel = item
				this.closeChannelView()
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
		width: 100%;
		height: 100%;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.dis_apply_item {
		width: 100%;
		min-height: 90rpx;
		padding: 10rpx 0rpx;
		box-sizing: border-box;
		border-bottom: #EEEEEE 2rpx solid;
		font-size: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.apply_title {
			width: 180rpx;
			color: #666;

			span {
				width: 30rpx;
				color: #FE2536;
				margin-right: 10rpx;
			}
		}

		.apply_content {
			width: calc(100% - 200rpx);
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: #333;
			input {
				width: 100%;
				height: 100%;
			}
			image {
				width: 30rpx;
				height: 30rpx;
			}
		}
	}
	.submit_view {
		position: fixed;
		bottom: 50rpx;
		left: 0;
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		view {
			width: 80%;
			height: 100%;
			margin-left: 10%;
			border-radius: 50rpx;
			font-size: 36rpx;
			// font-weight: bold;
			text-align: center;
			background-color: #F7C642;
		}
	}
	.mask_view {
		z-index: 999;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
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
