import router from "./router";
import store from "./store";

let registerRouteFresh = true;

/**
 * 添加路由守卫
 */


router.beforeEach((to, from, next) => {
    //判断token是否存在
    const token = sessionStorage.getItem("Authorization")
    if (token) {
        if (registerRouteFresh) {
            if (to.path === 'login') {
                sessionStorage.removeItem("Authorization")
                localStorage.removeItem('menu')
                next()
            }
            store.commit('addMenu', router)
            // next({...to, replace: true});
            console.log(111)
            registerRouteFresh = false
            next()
        } else {
            console.log('放过')
            next()
        }
    } else {
        if (to.path === '/login') {
            next()
        } else {
            sessionStorage.removeItem("Authorization")
            localStorage.removeItem('menu')
            this.$message.warning('为获取到登录信息，请登录')
            next('/login')
        }
    }
})
