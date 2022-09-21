import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router'
import router from './router'

import VueAxios from 'vue-axios'
import Validator from 'vue-validator'
import axios from "axios";
Vue.use(Validator)
// 关闭 Vue 的生产提示
Vue.config.productionTip = false
Vue.prototype.$axios= axios
import VueSimpleAlert from "vue-simple-alert";
Vue.use(VueSimpleAlert);


// 使用插件
Vue.use(ElementUI) // element ui 插件
Vue.use(VueRouter) // 路由插件
Vue.use(VueAxios, axios) // 使用 axios 插件
axios.defaults.baseURL = 'http://124.222.69.105:8055/v1'
axios.defaults.withCredentials = true
axios.defaults.headers['x-requested-with'] = 'XMLHttpRequest'
axios.defaults.headers['token'] = localStorage.getItem('token') || ''
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.responseType = 'json'

import MathJax from "@/common/js/MathJax.js";
Vue.prototype.MathJax = MathJax
Vue.config.productionTip = false
// 创建 Vue 实例对象
new Vue({
  render: h => h(App),  // render 函数将帮助解析模板，传入的参数 h 为一个函数，该函数可用来解析 App 这个组件
  router
}).$mount('#app') // 将 App.vue 组件挂载到 index.html 中的 id 为 app 的 div 标签上
