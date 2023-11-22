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

/**
 * 获取用户列表
 * @param data
 * @returns
 */
export async function getUserList(data) {
  return http.post('/user/list', data)
}

/**
 * 添加用户
 * @param data
 * @returns
 */
export async function addUser(data) {
  return http.post('/user/add', data)
}

/**
 * 修改用户
 * @param data
 * @returns
 */
export async function updateUser(data) {
  return http.put('/user/update', data)
}

/**
 * 修改用户
 * @param data
 * @returns
 */
export async function deleteUser(data) {
  return http.delete('/user/delete', data)
}


/**
 * 查询用户角色列表
 * @param data
 * @returns
 */
export async function getAssignRoleList(data) {
  return http.get('/user/getRoleListForAssign', data)
}


/**
 * 获取分配角色列表数据
 * @param data
 * @returns
 */
export async function getRoleIdByUserId(data) {
  return http.getRestApi('/user/getRoleByUserId', data)
}

/**
 * 分配角色
 * @param data
 * @returns
 */
export async function saveUserRole(data) {
  return http.post('/user/saveUserRole', data)
}


/**
 * 刷新token
 * @param data
 * @returns
 */
export async function refreshToken(data) {
  return http.post('/sysUser/refreshToken', data)
}



