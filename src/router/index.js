import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login.vue'
import Main from '../views/main-page.vue'
import Dymain from '../views/dy/main.vue'
import Wdsb from '../views/dy/wdsb.vue'
import Fbrw from '../views/dy/fbrw.vue'
import Fbrw2 from '../views/dy/fbrw2.vue'
import Gjcss from '../views/dy/gjcss.vue'
import Ckrw from '../views/dy/ckrw.vue'
import Xxfk from '../views/dy/xxfk.vue'
import Zhxx from '../views/dy/zhxx.vue'
// 快手
import Ksmain from '../views/ks/main.vue'
import Ksfbrw from '../views/ks/fbrw.vue'

// import { App } from '@/utils/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login,
    beforeEnter: (to, from, next) => {
      var userInfo = window.localStorage.getItem('token');
      if (userInfo) {
        next('/home')
      } else {
        next();
      }
      // if (App.getToken()) {
      //   next('/home')
      // } else {
      //   next()
      // }
    }
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Main
  },
  {
    path: '/dymain',
    component: Dymain
  },
  {
    path: '/ksmain',
    component: Ksmain
  },
  {
    path: '/equipment',
    component: Wdsb
  },
  {
    path: '/ksPublishTask',
    component: Ksfbrw
  },
  {
    path: '/publishTask',
    component: Fbrw
  },
  {
    path: '/publishTask2',
    component: Fbrw2
  },
  {
    path: '/keyWord',
    component: Gjcss
  },
  {
    path: '/checkTask',
    component: Ckrw
  },
  {
    path: '/feedback',
    component: Xxfk
  },
  {
    path: '/account',
    component: Zhxx
  },
  {
    path: '**',
    redirect: '/home'
  }
]

const router = new VueRouter({
  routes
})

// router.beforeEach((to, from, next) => {
//   // to 将要访问的路径
//   // from 从哪个路径跳转过来
//   // next 函数 表示放行
//   if (to.path === '/login') return next()
//   const tokenStr = window.localStorage.getItem('token');
//   alert(tokenStr);
//   if (!tokenStr) return next()
//   next('/home')
// })

export default router
