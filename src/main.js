import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/iconfont/iconfont.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import * as echarts from 'echarts';
import { Message, Notification } from 'element-ui';


Vue.use(ElementUI);
import './assets/css/iconfont/iconfont.css'
import './assets/css/base.css' //引入公共基础css文件
import http from './api/http'
import axios from './api/axios'
import util from './assets/js/util'
import * as socketApi from './api/socket'
import './assets/js/world.js' // 引入世界地图
import dragresize from 'v-dragresize'; // 引入可以拖动元素边框组件
import './assets/icons/index.js'

import * as filters from './filters' // global filters
Object.keys(filters).forEach(key => { // register global filters
  Vue.filter(key, filters[key])
})

import websoketLib from "./components/websocket/websoketLib.js"; //导入websocket封装类
Vue.use(websoketLib);

Vue.prototype.$socketApi = socketApi
Vue.prototype.$echarts = echarts
Vue.prototype.$http = http;
Vue.prototype.$axios = axios;
Vue.prototype.$util = util;
Vue.prototype.$message = Message;

Vue.config.productionTip = false
import { fullScreenContainer,decoration8,decoration5,decoration10,borderBox1,borderBox11,borderBox12,digitalFlop } from '@jiaminghi/data-view'
Vue.use(fullScreenContainer)
	.use(decoration8)
	.use(decoration5)
	.use(decoration10)
	.use(borderBox1)
	.use(borderBox11)
	.use(borderBox12)
	.use(digitalFlop)
	.use(dragresize)
Array.prototype.removearr = function (val) {          //删除数组中指定的项
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};

// // 全局前置守卫
// // router.beforeEach((to, from, next) => {
// // 	// next() // 无需登陆直接跳转到首页
// // 	// const isLoggedIn = localStorage.getItem('isLogin');
// // 	const token = localStorage.getItem('token');
// // 	if (to.matched.some(record => record.meta.requiresAuth)) {
// // 		// 如果需要登录才能访问该页面
// // 		if (token) {
// // 			next();
// // 		} else {
// // 			next({ path: '/' }); // 未登录则跳转到首页
// // 			Notification({
// // 				title: '请先登录',
// // 				type: 'success',
// // 				duration: 2500
// // 			})
// // 		}
// // 	} else {
// // 		// 不需要登录则直接跳转
// // 		next();
// // 	}
// // });
// 全局前置守卫
router.beforeEach((to, from, next) => {
	next() // 无需登陆直接跳转到首页
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
