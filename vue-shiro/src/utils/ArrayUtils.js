/**
 * 判断两个数组中的值是否相同
 * @param arr1
 * @param arr2
 * @returns {*}
 */
export function compareArray(arr1, arr2) {
  return arr1.every(i => arr2.includes(i)) && arr2.every(i => arr1.includes(i));
}

/**
 * 数组去重并排序
 * @param array
 * @returns {*}
 */
export function uniqueArray(array) {
  return array.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
}
