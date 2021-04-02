import http from './interface'

// 1.微信code换取openid *
export const requestOpenIdByCode = (data) => {
	return http.request({
		url: '/wechat/pushCode',
		method: 'GET',
		data,
		notNeedToken: true
	})
}

// 2.微信授权获取用户信息解密
export const requestGetWechatUserInfo = (data) => {
	return http.request({
		url: '/wechat/getUser',
		method: 'POST',
		type: 'json',
		data,
	})
}

// 3.更新微信信息
export const requestUpdateWechatUserInfo = (data) => {
	return http.request({
		url: '/channelUser/busChannelUser/updateWeChat',
		method: 'POST',
		type: 'json',
		data,
	})
}

// 4.通过openId获取用户信息
export const requestUserInfoByOpenId = (data) => {
	return http.request({
		url: '/channelUser/busChannelUser/queryByWeChatOpenid',
		method: 'GET',
		data,
	})
}

// 5.通过openId获取token
export const requestWeChatLoginByOpenId = (data) => {
	return http.request({
		url: '/sys/weChatOpenidLogin',
		method: 'GET',
		data,
		notNeedToken: true
	})
}

// 5.我的页获取未使用的票
export const requestMineUnusedTicketList = (data) => {
	return http.request({
		url: '/order/busOrderTicket/listWeChat',
		method: 'GET',
		data,
	})
}

// 6.获取首页分类及商品列表
export const requestHomeTicketList = (data) => {
	return http.request({
		url: '/promotion/busPromotion/findAll',
		method: 'GET',
		data,
	})
}

// 7.获取首页广告列表
export const requestHomeAdvertisingList = (data) => {
	return http.request({
		url: '/advertising/busAdvertising/list',
		method: 'GET',
		data,
	})
}

// 8.获取票据列表
export const requestTicketList = (data) => {
	return http.request({
		url: '/promotion/busPromotion/findAll',
		method: 'GET',
		data,
	})
}

// 查询票据列表
export const requestSearchTicketList = (data) => {
	return http.request({
		url: '/goods/busGoods/listWeChat',
		method: 'GET',
		data,
	})
}

// 9.获取票据详情
export const requestTicketDetailInfo = (data) => {
	return http.request({
		url: '/goods/busGoods/queryById',
		method: 'GET',
		data,
	})
}

// 10.提交订单
export const requestSubmitOrder = (data) => {
	return http.request({
		url: '/order/busOrder/addByWeChatOpenid',
		method: 'POST',
		type: 'json',
		data,
	})
}

// 11.获取订单列表
export const requestOrderList = (data) => {
	return http.request({
		url: '/order/busOrder/listWeChat',
		method: 'GET',
		data,
	})
}

// 12.获取订单详情
export const requestOrderDetailInfo = (data) => {
	return http.request({
		url: '/order/busOrder/queryById',
		method: 'GET',
		data,
	})
}

// 13.删除订单
export const requestOrderDelete = (data) => {
	return http.request({
		url: '/order/busOrder/deleteState',
		method: 'DELETE',
		data,
	})
}

// 13.查询订单中票据详情
export const requestTicketDetailInOrder = (data) => {
	return http.request({
		url: '/order/busOrderTicket/queryBusTicketId',
		method: 'GET',
		data,
	})
}

// 13.退票
export const requestTicketRefund = (data) => {
	return http.request({
		// url: '/order/busOrder/refund',
		url: '/order/busOrderTicket/refundBatch',
		method: 'POST',
		data,
		type: 'json'
	})
}

// 14.获取渠道列表
export const requestChannelList = (data) => {
	return http.request({
		url: '/channel/busChannel/list',
		method: 'GET',
		data,
	})
}

// 15.分销申请
export const requestApplyDistribution = (data) => {
	return http.request({
		url: '/channelUser/busChannelUser/addAudit',
		method: 'PUT',
		data,
		type: 'json'
	})
}

// 16.获取通用字典
export const requestDictData = (data) => {
	return http.request({
		url: '/util/dataDictionary/findAllByCode',
		method: 'GET',
		data,
	})
}

// 17.票据核销
export const requestTicketVerification = (data) => {
	return http.request({
		url: '/order/busOrderTicket/verification',
		method: 'PUT',
		data,
		type: 'json'
	})
}

// 18.我的业绩
export const requestMyPerformance = (data) => {
	return http.request({
		url: '/statistical/weChatPerformance',
		method: 'GET',
		data,
	})
}

// 19.我的业绩分页明细
export const requestMyPerformanceDetailList = (data) => {
	return http.request({
		url: '/statistical/weChatPagePerformance',
		method: 'GET',
		data,
	})
}

// 20.查询支付结果
export const requestCheckPaymentResult = (data) => {
	return http.request({
		url: '/order/busOrder/queryAppPay',
		method: 'POST',
		data,
		type: 'json'
	})
}

// 21.取消小程序下单
export const requestCancelAppPay = (data) => {
	return http.request({
		url: '/order/busOrder/cancelAppPay',
		method: 'POST',
		data,
		type: 'json',
		notShowLoading: true
	})
}


// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
	requestOpenIdByCode,
	requestGetWechatUserInfo,
	requestUpdateWechatUserInfo,
	requestUserInfoByOpenId,
	requestWeChatLoginByOpenId,
	requestMineUnusedTicketList,
	requestHomeTicketList,
	requestHomeAdvertisingList,
	requestTicketList,
	requestSearchTicketList,
	requestTicketDetailInfo,
	requestSubmitOrder,
	requestOrderList,
	requestOrderDetailInfo,
	requestOrderDelete,
	requestTicketDetailInOrder,
	requestTicketRefund,
	requestChannelList,
	requestApplyDistribution,
	requestDictData,
	requestTicketVerification,
	requestMyPerformance,
	requestMyPerformanceDetailList,
	requestCheckPaymentResult,
	requestCancelAppPay
}
