import Vue from 'vue'
import Router from 'vue-router'
import Layout from './layout/index.vue'

Vue.use(Router)

const originalPush = Router.prototype.push
// 修改原型对象中的push方法(解决报错NavigationDuplicated: Avoided redundant navigation to current location)
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      title: '登录',
      component: () => import('@/views/login/index')
    },
    {
      path: '/range',
      name: 'layout',
      component: Layout,
      redirect: '/range/home',
      children: [
        {
          path: 'home',
          name: 'home',
          title: '仪表盘',
          component: () => import('@/views/home/index'),
          meta: { requiresAuth: true } // 需要登录才能访问         
        },
        {
          path: 'menuSurrogateInformation',
          name: 'menuSurrogateInformation',
          title: '代理信息',
          component: () => import('@/views/menuSurrogateInformation/index'),
          meta: { requiresAuth: true } // 需要登录才能访问
        },
        {
          path: 'menuMBGZ',
          name: 'menuMBGZ',
          title: '目标感知',
          component: () => import('@/views/menuMBGZ/index'),
          meta: { requiresAuth: true } // 需要登录才能访问
        },
        {
          path: 'menuSysManagement',
          name: 'menuSysManagement',
          title: '系统管理',
          component: () => import('@/views/menuSysManagement/index'),
          meta: { requiresAuth: true } // 需要登录才能访问
        },
        {
          path: 'menuTaskManagement',
          name: 'menuTaskManagement',
          title: '任务管理',
          component: () => import('@/views/menuTaskManagement/index'),
          meta: { requiresAuth: true } // 需要登录才能访问
        },
        {
          path: 'menuSysIntroduce',
          name: 'menuSysIntroduce',
          title: '系统介绍',
          component: () => import('@/views/menuSysIntroduce/index'),
          meta: { requiresAuth: true } // 需要登录才能访问
        },
        {
          path: 'menuTaskInfo',
          name: 'menuTaskInfo',
          title: '任务详情',
          component: () => import('@/views/menuTaskInfo/index'),
          meta: { requiresAuth: true } // 需要登录才能访问
        },
        {
          path: 'menuMBZTGZ',
          name: 'menuMBZTGZ',
          title: '目标状态详情',
          component: () => import('@/views/menuMBZTGZ/index'),
          meta: { requiresAuth: true } // 需要登录才能访问
        }
      ]
    }
  ]

})