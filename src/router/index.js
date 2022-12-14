// 此文件专门负责项目的路由

import VueRouter from "vue-router"

// 引入组件
import PastPapers from "@/views/paper/PastPapers";
import Login from '../views/login/Login'
import Register from '../views/register/Register'
import Home from '../views/home/Home'
import GeneratePaper from '../views/paper/GeneratePaper'
import ModifyPassword from "@/views/modify/ModifyPassword";
import viewScore from "@/views/paper/ViewScore";
import Paper from "@/views/paper/Paper";
import Vue from "vue";
import PrepareGenerate from "@/views/paper/PrepareGenerate";

// 创建并暴露一个路由器
Vue.use(VueRouter);
const router = new VueRouter({
    mode: 'history',    // 路由模式，该模式不会在地址中显示井号#
    routes: [
        {
            path: '/',          // 路径
            redirect: '/login'  // 重定向
        },
        {
            path: '/login',     // 路径
            component: Login    // 跳转到的组件
        },
        {
            path: '/register',     // 路径
            component: Register    // 跳转到的组件
        },
        {
            path: '/home',     // 路径
            component: Home    // 跳转到的组件
        },
        {
            path:'/generate',
            component:GeneratePaper
        },

        {
            path:'/modify',
            component:ModifyPassword
        },
        {
            path:'/pastPapers',
            component:PastPapers
        },
        {
            path:'/viewScore',
            component:viewScore
        },
        {
            path:'/prepareGenerate',
            component:PrepareGenerate
        },
        {
            path:'/specifyPaper',
            component:Paper
        }
    ]
})

// 导航守卫，前置处理
router.beforeEach((to, from, next) => {
    let isAuthenticated = !!sessionStorage.getItem('username')
    // 如果路由要跳转到除了登录和注册的界面的话就判断是否已经登录，如果没有登录就强制跳到登录界面
    // 判断是否登录
    if (to.path !== '/login' && to.path !== '/register' && !isAuthenticated) {
        next({ path: '/login' })
        // eslint-disable-next-line no-undef
        Message({
            message: '请先登录！',
            type: "warning",
        });
    } else next()
})
export default router
