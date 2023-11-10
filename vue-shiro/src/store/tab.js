import {getChildrenPath} from "../utils/RouterUtil";

export default {
  state: {
    menu: [],
    collapseMenu: false
  },
  mutations: {
    setMenu(state, val) {
      state.menu = val
      localStorage.setItem('menu', JSON.stringify(state.menu))
    },
    addMenu(state, router) {
      getChildrenPath(state.menu, router)
    },
    collapseMenu(state) {
      state.collapseMenu = !state.collapseMenu
    }


  }
}
