import http from "../utils/request";

/**
 * 登录
 * @param data 用户名和密码
 * @returns token
 */
export const login = (data) => {
  return http.post("/login", data)
}

/**
 * 获取菜单数据
 * @returns 菜单数据
 */
export const getMenu = () => {
  return http.get("/permission/getMenu")
}
