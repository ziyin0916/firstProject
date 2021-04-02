import Vue from 'vue'
import App from './App'
import api from '@/common/http/index.js'

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$api = api

const app = new Vue({
    ...App
})
app.$mount()
