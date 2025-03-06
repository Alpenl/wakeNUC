let storage = uni.getStorageSync('storage') || {}

function clear() {
  storage = {}
  save()
}

function getKey(key) {
  return storage[key]
}

function setKey(key, value) {
  storage[key] = value
  uni.setStorageSync('storage', storage)
}

function removeKey(key) {
  delete storage[key]
  uni.setStorageSync('storage', storage)
}

function save() {
  uni.setStorageSync('storage', storage)
}

export { getKey, setKey, removeKey, save, clear }
