import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入自定义路由组件
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Dashboard from '../components/Local/Dashboard.vue'
import Images from '../components/Docker/Images.vue'
import Containers from '../components/Docker/Containers.vue'
import Networks from '../components/Docker/Networks.vue'
import Volumes from '../components/Docker/Volumes.vue'
import Search from '../components/Docker/Search.vue'
import Users from '../components/Settings/Users.vue'
import Config from '../components/Settings/Config.vue'

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
      { path: '/dashboard', component: Dashboard },
      { path: '/images', component: Images },
      { path: '/containers', component: Containers },
      { path: '/networks', component: Networks },
      { path: '/volumes', component: Volumes },
      { path: '/search', component: Search },
      { path: '/users', component: Users },
      { path: '/config', component: Config }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
