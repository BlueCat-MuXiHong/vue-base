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

/**
 * 分页获取数据
 * @param data 分页数据
 * @returns 用户列表
 */
export const getUserByPage = (data) => {
  return http.post("/user/getUserByPage", data)
}

/**
 * 分页获取角色列表
 * @param data
 * @returns 角色列表
 */
export const getRoleByPage = (data) => {
  return http.post('/role/getRoleByPage', data)
}

/**
 * 跟新用户
 * @param data
 * @returns
 */
export const updateUser = (data) => {
  return http.put('/user', data)
}

/**
 * 添加用户
 * @param data
 * @returns
 */
export const addUser = (data) => {
  return http.post('/user', data)
}

/**
 * 删除用户
 * @param params
 * @returns
 */
export const delUser = (params) => {
  return http.delete(`/user?usercode=${params}`)
}


/**
 * 修改用户角色
 * @param data
 * @returns
 */
export const insertUserRoles = (data) => {
  return http.post('/user/insertUserRoles', data)
}

/**
 * 根据
 * @param params
 * @returns
 */
export const getPermissionByRoleId = (params) => {
  return http.get(`/permission/getPermissionByRoleId?roleId=${params}`)
}

/**
 * 添加角色权限
 * @param data
 * @returns
 */
export const insetRolePermission = (data) => {
  return http.post("/role/insetRolePermission", data)
}

