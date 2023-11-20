import http from '@/utils/request'

export function getRoutes() {

}

/**
 * 查询角色列表
 * @param data
 * @returns
 */
export async function getRoles(data) {
  return http.post('/role/list', data)

}

export function addRole(data) {
  return http.post("/role/add", data);
}

export function updateRole(id, data) {

}

/**
 * 删除用户
 * @param params
 * @returns
 */
export function deleteRole(params) {
  return http.delete('/role/delete', params)
}

/**
 * 检查角色是否被使用
 * @param params
 * @returns
 */
export function checkRole(params) {
  return http.getRestApi('/role/check', params)
}

