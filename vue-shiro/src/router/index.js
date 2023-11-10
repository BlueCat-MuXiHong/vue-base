import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


//解决编程式路由往同一地址跳转时会报错的情况
const originalPush = Router.prototype.push;
const originalReplace = Router.prototype.replace;
//push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};
//replace
Router.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch(err => err);
};





const routes = [
  {
    path: '/login',
    name: "login",
    component: () => import('../components/Login')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('../Views/Main'),
    children: []
  }
]


const router = new Router({
  mode: 'history',
  routes: routes
})

export default router


