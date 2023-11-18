import http from "@/utils/request";

/**
 * 查询部门列表
 * @param params
 * @returns
 */
export async function getDepartmentList(params) {
  return http.post("/department/list", params);
}

/**
 * 获取所属部门列表
 * @returns
 */
export async function getParentTreeList() {
  return http.get('/department/parent/list')
}

/**
 * 新增部门
 * @returns
 */
export async function addDept(data) {
  return http.post('/department/add', data)
}

/**
 * 编辑部门
 * @returns
 */
export async function updateDept(data) {
  return http.put('/department/update', data)
}

/**
 * 判断部门下是否有子部门
 * @param data
 * @returns
 */
export function checkDepartment(data) {
  return http.getRestApi('/department/check', data)
}

/**
 * 删除部门
 * @param data
 * @returns
 */
export function deleteDepartmentById(data) {
  return http.delete('/department/delete', data)
}




