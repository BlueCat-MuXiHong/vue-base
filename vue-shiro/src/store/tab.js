import Cookie from "js-cookie";
import {getChildrenPath} from "../utils/RouterUtil";

export default {
  state: {
    menu: [],
    collapseMenu: false
  },
  mutations: {
    setMenu(state, val) {
      state.menu = val

      Cookie.set('menu', JSON.stringify(state.menu))
    },
    addMenu(state, router) {
      getChildrenPath(router)
    },
    collapseMenu(state) {
      state.collapseMenu = !state.collapseMenu
    }


  }
}
