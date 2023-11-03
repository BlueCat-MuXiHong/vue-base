import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/login',
    name: "login",
    component: () => import('../components/Login')
  },
  {
    path: '/home',
    name: 'Main',
    component: () => import('../Views/Main'),
    children: []
  }
]

const router = new Router({
  mode: 'history',
  routes: routes
})

export default router


