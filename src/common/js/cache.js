// 缓存相关(存储)
import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

// maxLen长度的arr中插入val
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  // 有并且为第一个 不处理
  if (index === 0) {
    return
  }
  // 有并且不在第一个 先删除原来的
  if (index > 0) {
    arr.splice(index, 1)
  }
  // 插入第一个
  arr.unshift(val)
  // 超过最大长度 删除最后一个
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}


function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}


// 保存搜索历史
export function saveSearch(query) {
  // 本地存储数组
  let searches = storage.get(SEARCH_KEY, [])
  // 进行比较后插入
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  // 保存
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

// 删除一个
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}
