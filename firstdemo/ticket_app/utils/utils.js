import config from '@/common/http/config.js'
// 校验手机号
function checkPhoneNumber(val) {
	let reg = /^1[0-9]{10}$/
	if (val == '' || val.length < 11 || !reg.test(val)) {
		this.showToastNoIcon('请输入正确的手机号')
		return false
	}
	return true
}
// 弹出信息
function showToastNoIcon(msg) {
	if (msg) {
		uni.showToast({
			title: msg,
			icon: 'none'
		})
	}
}

// 获取图片链接
function getImgView(url) {
	if (url && url.length > 0) {
		if (url && url.indexOf(',') > 0) {
			url = url.substring(0, url.indexOf(','))
		}
		if (url.indexOf('http') != -1) {
			return url
		}
		return config.BASEIMAGEURL + url
	}
	return ''
}

// 去除字符串中的空格
function strTrim(str) {
	if (str && str.length > 0) {
		return str.replace(/\s/g, "");
	}
	return ''
}

// 网页链接格式胡
function httpStrFormat(url) {
	let str = strTrim(url)
	if (str.length == 0) {
		return ''
	}
	if (str.indexOf('http://') != -1 || str.indexOf('https://') != -1) {
		return str
	} else {
		return 'http://' + str
	}
}

function phoneNumberSecretFormat(phone) {
	var reg = /^(\d{3})\d*(\d{4})$/;
	return phone.replace(reg,'$1****$2')
}


module.exports = {
	checkPhoneNumber,
	showToastNoIcon,
	getImgView,
	strTrim,
	httpStrFormat,
	phoneNumberSecretFormat
}
