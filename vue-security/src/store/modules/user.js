import {getInfo, login, logout} from '@/api/user'
//设置token过期时间
import {getToken, removeToken, setToken, setTokenTime} from '@/utils/auth'
import router, {resetRouter} from '@/router'

const state = {
  token: getToken(),//获取token信息
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  //设置token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  //设置个人介绍
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  //设置用户名
  SET_NAME: (state, name) => {
    state.name = name
  },
  //设置用户名
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  //设置角色
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  //将用户id保存到store中
  SET_USERID: (state, userId) => {
    state.userId = userId
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    //解析出用户名和密码
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      //登录
      login({ username: username.trim(), password: password }).then(response => {
        //解析出token,和过期时间
        const {token, expireTime} = response
        commit('SET_TOKEN', token)
        setToken(token)
        setTokenTime(expireTime)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }
        //从后端返回的数据中解构出用户id
        const {roles, name, avatar, introduction, id} = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        //将用户id保存到vuex中
        commit('SET_USERID', id)
        //将权限字段保存到sessionStorage中
        sessionStorage.setItem("codeList", JSON.stringify(roles));
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
