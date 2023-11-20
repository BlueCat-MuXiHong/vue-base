import http from "@/utils/request";

/**
 * 查询菜单列表
 * @param data
 * @returns
 */
export async function getMenuList(data) {
  return http.post('/permission/list', data)
}

/**
 * 查询上级菜单列表
 * @param data
 * @returns
 */
export async function getParentMenuList(data) {
  return http.get('/permission/parent/list', data)
}

/**
 * 添加菜单
 * @param data
 * @returns
 */
export async function addMenu(data) {
  return http.post("/permission/add", data)
}

/**
 * 编辑菜单
 * @param data
 * @returns
 */
export async function updateMenu(data) {
  return http.put("/permission/update", data)
}

/**
 * 检查菜单下是否有子菜单
 * @param params
 * @returns
 */
export async function checkPermission(params) {
  return http.getRestApi('/permission/check', params)
}

/**
 * 删除菜单
 * @param params
 * @returns
 */
export async function deletePermissionById(params) {
  return http.delete('/permission/delete', params)
}




