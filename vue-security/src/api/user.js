import http from "@/utils/request";

/**
 * 用户登录
 * @returns
 */
export async function login(data) {
  return http.login("/user/login", data);
}

/**
 * 获取用户信息和权限信息
 * @returns
 */
export async function getInfo() {
  return http.get("/sysUser/getInfo");
}

/**
 * 退出登录
 * @returns
 */
export async function logout(param) {
  return http.post("/sysUser/logout", param);
}

/**
 * 获取用户菜单信息
 * @returns {Promise<void>}
 */
export async function getMenuList() {
  return http.get('/sysUser/getMenuList');
}
