import router from "./router";
import store from "./store";
import {Notification} from 'element-ui'

let registerRouteFresh = true;

/**
 * 添加路由守卫
 */


router.beforeEach((to, from, next) => {
    //判断token是否存在
    const token = sessionStorage.getItem("Authorization")
    if (token) {
        if (to.path === 'login') {
            sessionStorage.removeItem("Authorization")
            localStorage.removeItem('menu')
            next()
        }
        if (registerRouteFresh) {
            store.commit('addMenu', router)
            registerRouteFresh = false
            next({...to, replace: true});
        } else {
            //如果输入的是一个不存在的路由，则会跳转到登录页
            if (to.matched.length === 0) {
                sessionStorage.removeItem("Authorization")
                localStorage.removeItem('menu')
                next('/login')
            }
            next()
        }
    } else {
        if (to.path === '/login') {
            next()
        } else {
            sessionStorage.removeItem("Authorization")
            localStorage.removeItem('menu')
            Notification.error({message: '未获取到登录信息'})
            next('/login')
        }
    }
})
