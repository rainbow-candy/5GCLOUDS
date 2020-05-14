import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login.vue'
import Main from '../views/main-page.vue'
import Dymain from '../views/dy/main.vue'
import Wdsb from '../views/dy/wdsb.vue'
import Fbrw from '../views/dy/fbrw.vue'
// import Fbrw2 from '../views/dy/fbrw2.vue'
import FbrwBf from '../views/dy/fbrw3.vue'
import Gjcss from '../views/dy/gjcss.vue'
import Ckrw from '../views/dy/ckrw.vue'
import Xxfk from '../views/dy/xxfk.vue'
import Zhxx from '../views/dy/zhxx.vue'
// 快手
import Ksmain from '../views/ks/main.vue'
import Ksfbrw from '../views/ks/fbrw.vue'
import Ksfbrw2 from '../views/ks/fbrw2.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login,
    beforeEnter: (to, from, next) => {
      const userInfo = window.sessionStorage.getItem('token');
      if (userInfo) {
        next('/home')
      } else {
        next();
      }
    }
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Main,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/dymain',
    component: Dymain,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/ksmain',
    component: Ksmain,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/equipment',
    component: Wdsb,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/ksPublishTask',
    component: Ksfbrw,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/publishTask',
    component: Fbrw,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/kspublishTask2',
    component: Ksfbrw2,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/publishTask2',
    component: FbrwBf
  },
  {
    path: '/keyWord',
    component: Gjcss,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/checkTask',
    component: Ckrw,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/feedback',
    component: Xxfk,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/account',
    component: Zhxx,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '**',
    redirect: '/login'
  }
]

const router = new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes
})

router.beforeEach((to, from, next) => {
  // 判断该路由是否需要登录权限
  if (to.matched.some(record => record.meta.requireAuth)) {
    // 判断当前的token是否存在 ； 登录存入的token
    if (window.sessionStorage.getItem('token')) {
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next();
  }
});
export default router
