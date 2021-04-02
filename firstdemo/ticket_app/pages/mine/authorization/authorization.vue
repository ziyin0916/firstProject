<template>
	<view class="auth_view">
		<image src="/static/mine/ticket.png"></image>
		<view class="content">微信授权页</view>
		<view class="remark">授权并同意使用微信号登录小程序</view>
		<!-- #ifdef MP-WEIXIN -->
		<button class="userinfo_button" v-if="!isAuthUserInfo" open-type="getUserInfo" @getuserinfo="getUserInfo">授权获取昵称和头像</button>
		<button class="login_button" v-else open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">授权获取手机号</button>
		<!-- #endif -->
	</view>
</template>

<script>
	const app = getApp()
	import utils from '@/utils/utils.js'
	export default {
		data() {
			return {
				isAuthUserInfo: false,
			}
		},
		onLoad(option) {
			this.setDefaultData()
			let that = this
			// #ifdef MP-WEIXIN
			uni.getSetting({
				success: (res) => {
					console.log('getSetting', res);
					if (res.authSetting['scope.userInfo']) {
						that.isAuthUserInfo = true
					} else {
						that.isAuthUserInfo = false
					}
				}
			})
			// #endif
		},
		methods: {
			setDefaultData() {
				let that = this
				uni.login({
					provider: 'weixin',
					success(res) {
						let code = res.code
						that.$api.requestOpenIdByCode({
							code: code
						}).then(res => {
							app.globalData.openid = res.data.result
						})
					}
				})
			},
			
			
			getPhoneNumber(e) {
				let detail = e.detail || {}
				let errMsg = detail.errMsg
				if (errMsg === 'getPhoneNumber:ok') {
					let that = this
					let encryptedData = detail.encryptedData || ''
					let iv = detail.iv || ''
					this.$api.requestGetWechatUserInfo({
						encryptedData,
						iv,
						openid: app.globalData.openid
					}).then(res => {
						console.log(res);
						that.$api.requestUpdateWechatUserInfo({
							weChatOpenid: app.globalData.openid,
							phone: res.data.result.phoneNumber
						}).then(() => {
							that.$api.requestWeChatLoginByOpenId({
								weChatOpenid: app.globalData.openid
							}).then(response => {
								app.globalData.token = response.data.result && response.data.result.token
								uni.setStorageSync('userToken', app.globalData.token)
								uni.navigateBack()
							})
						})
					})
				} else {
					utils.showToastNoIcon('您拒绝了微信授权获取手机号')
				}
			},

			getUserInfo(e) {
				let detail = e.detail || {}
				let errMsg = detail.errMsg
				if (errMsg === 'getUserInfo:ok') {
					let that = this
					let userInfo = detail.userInfo || {}
					let nickName = userInfo.nickName
					let avatarUrl = userInfo.avatarUrl
					that.$api.requestUpdateWechatUserInfo({
						weChatOpenid: app.globalData.openid,
						weChatName: nickName,
						weChatUrl: avatarUrl
					}).then(() => {
						// uni.navigateBack()
					})
					this.isAuthUserInfo = true
				} else {
					utils.showToastNoIcon('您拒绝了微信授权获取昵称和头像')
				}
			},
		}
	}
</script>

<style lang="less">
	.auth_view {
		padding-top: 200rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;

		image {
			width: 160rpx;
			height: 160rpx;
		}

		.content {
			font-size: 32rpx;
			margin-top: 60rpx;
			font-weight: bold;
		}

		.remark {
			font-size: 26rpx;
			margin-top: 30rpx;
			color: #999999;
		}
		
		.userinfo_button {
			margin-top: 60rpx;
			width: 80%;
			height: 90rpx;
			line-height: 90rpx;
			border-radius: 45rpx;
			background-color: #F7C642;
		}

		.login_button {
			margin-top: 80rpx;
			width: 80%;
			height: 90rpx;
			line-height: 90rpx;
			border-radius: 45rpx;
			background-color: #F7C642;

		}
	}
</style>
