/**
 * 通用uni-app网络请求
 * 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
 */
/*

*/
const app = getApp()
import myconfig from './config.js'
export default {
	config: {
		baseUrl: myconfig.BASEURL,
		header: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: {},
		method: "POST",
		dataType: "json",
		/* 如设为json，会对返回的数据做一次 JSON.parse */
		responseType: "text",
		success() {},
		fail() {},
		complete() {}
	},
	// 拦截器
	interceptor: {
		request: null, //请求
		response: null //响应
	},
	request(options) {
		if (!options) {
			options = {}
		}
		if (!options.notShowLoading) {
			uni.showLoading({
				title: '加载中...',
				mask: true
			})
		}

		options.baseUrl = options.baseUrl || this.config.baseUrl
		options.dataType = options.dataType || this.config.dataType
		options.url = options.baseUrl + options.url
		options.sslVerify = false
		options.method = options.method || this.config.method
		if (options.type === 'json') {
			this.config.header['Content-Type'] = 'application/json;charset=UTF-8'
		} else {
			this.config.header['Content-Type'] = 'application/x-www-form-urlencoded'
		}
		if (!options.notNeedToken) {
			this.config.header['X-Access-Token'] = getApp().globalData.token || ''
		}
		// this.config.header['X-Access-Token'] = (uni.getStorageSync('userToken') || '')
		return new Promise((resolve, reject) => {
			let _config = null

			options.complete = (response) => {
				if (!options.notShowLoading) {
					setTimeout(() => {
						uni.hideLoading()
					}, 100)
				}

				let statusCode = response.statusCode
				response.config = _config
				if (process.env.NODE_ENV === 'development') {
					if (statusCode === 200) {

					}
				}
				if (this.interceptor.response) {
					let newResponse = this.interceptor.response(response)
					if (newResponse) {
						response = newResponse
					}
				}
				// 统一的响应日志记录
				_reslog(response)
				if (statusCode === 200) { //成功
					if (response.data.success == true) {
						resolve(response)
					} else {
						if (response.data.code == 510) {
							uni.$emit('tokenInvalid')
						} else {
							uni.showToast({
								icon: 'none',
								title: response.data.message || '网络请求失败，请稍后重试'
							})
						}
						reject(response)
					}
				} else {
					reject(response)
				}
			}

			_config = Object.assign({}, this.config, options)
			_config.requestId = new Date().getTime()

			if (this.interceptor.request) {
				this.interceptor.request(_config)
			}

			// 统一的请求日志记录
			_reqlog(_config)

			if (process.env.NODE_ENV === 'development') {
				// console.log("【" + _config.requestId + "】 地址：" + _config.url)
				if (_config.data) {
					// console.log("【" + _config.requestId + "】 参数：" + JSON.stringify(_config.data))
				}
			}

			uni.request(_config);
		});
	},
	get(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	post(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	put(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'PUT'
		return this.request(options)
	},
	delete(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	}
}


/**
 * 请求接口日志记录
 */
function _reqlog(req) {
	if (process.env.NODE_ENV === 'development') {
		// console.log("【" + req.requestId + "】 地址：" + req.url)

		if (req.statusCode == '401') {
			console.log("interface---154");
			uni.reLaunch({
				url: '/pages/login/login.vue'
			});
		}

		if (req.data) {
			console.log("【" + req.requestId + "】 请求参数：" + JSON.stringify(req.data))
		}
	}
	//TODO 调接口异步写入日志数据库
}

/**
 * 响应接口日志记录
 */
function _reslog(res) {
	let _statusCode = res.statusCode;
	if (process.env.NODE_ENV === 'development') {
		// console.log("【" + res.config.requestId + "】 地址：" + res.config.url)
		if (res.config.data) {
			// console.log("【" + res.config.requestId + "】 请求参数：" + JSON.stringify(res.config.data))
		}
		// console.log("【" + res.config.requestId + "】 响应结果：" + JSON.stringify(res))
	}
	//TODO 除了接口服务错误外，其他日志调接口异步写入日志数据库
	switch (_statusCode) {
		case 200:
			break;
		case 401:
			break;
		case 404:
			break;
		default:
			break;
	}
}
