<script>
	export default {
		globalData: {
			shareImageUrl: 'http://minio.fangshangqu.net/ticket-system/logo180.png',
			successMusic: 'http://minio.fangshangqu.net/ticket-system/success.mp3',
			failureMusic: 'http://minio.fangshangqu.net/ticket-system/failure.mp3',
			openid: '',
			token: '',
			historyPath: '',
			hasNoNetwork: false,
		},
		onLaunch: function() {
			let that = this
			uni.$on('tokenInvalid', () => {
				// #ifdef MP-WEIXIN
				uni.login({
					provider: 'weixin',
					success(res) {
						let code = res.code
						that.$api.requestOpenIdByCode({
							code: code
						}).then(res => {
							that.globalData.openid = res.data.result
							that.$api.requestWeChatLoginByOpenId({
								weChatOpenid: that.globalData.openid
							}).then(response => {
								that.globalData.token = response.data.result && response.data.result.token
								uni.setStorageSync('userToken', that.globalData.token)
								console.log('重新获取token成功')
							})
						})
					}
				})
				// #endif
			})

			uni.onNetworkStatusChange(function(res) {
				if (!res.isConnected) {
					that.globalData.hasNoNetwork = true
					uni.reLaunch({
						url: '/pages/home/noNetworkPage'
					})
				} else {
					if (that.globalData.hasNoNetwork) {
						that.globalData.hasNoNetwork = false
						uni.reLaunch({
							url: '/pages/home/home'
						})
					}
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
