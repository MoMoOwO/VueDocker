import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入自定义路由组件
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Dashboard from '../components/Local/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/dashboard', component: Dashboard }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
