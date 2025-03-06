// 基础配置和工具函数导入
import { base64Encode } from '../utils/base64'
import { hexMD5 } from '../utils/md5'
import { getKey, setKey } from '../utils/storage'
import { emit } from '../utils/eventBus'

/**
 * 全局配置对象
 * @constant {Object} CONFIG
 */
const CONFIG = {
  baseURL: 'http://127.0.0.1:8080/', // API基础URL
  timeout: 10000, // 请求超时时间（毫秒）
}

/**
 * 工具函数集合
 * @namespace utils
 */
const utils = {
  /**
   * 生成指定长度的随机字符串
   * @param {number} length - 字符串长度
   * @param {string} chars - 可用字符集
   * @returns {string} 随机字符串
   */
  randomString(length, chars) {
    let result = ''
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)]
    }
    return result
  },

  /**
   * 对请求数据进行签名
   * @param {string} url - 请求URL
   * @param {Object} params - 请求参数
   * @param {string} key - 签名密钥
   * @returns {Object} 带签名的参数对象
   */
  signData(url, params, key) {
    // 添加时间戳和密钥
    params.ts = Date.now()
    params.key = key

    // 参数排序
    const list = []
    for (const i in params) {
      list.push(i + '=' + encodeURIComponent(params[i]))
    }
    list.sort()

    // 计算签名
    params.sign = hexMD5('/' + encodeURI(url) + list.join('&') + 'app_secret')
    return params
  },

  /**
   * 构建URL查询字符串
   * @param {Object} params - 参数对象
   * @returns {string} 查询字符串
   */
  buildQueryString(params) {
    return Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')
  },

  /**
   * 显示统一的消息提示
   * @param {string} message - 提示信息
   * @param {string} [type='error'] - 提示类型
   */
  showToast(message, type = 'error') {
    uni.showToast({
      title: message || '未知错误',
      icon: type === 'success' ? 'success' : 'none',
      duration: 2000,
    })
  },
}

/**
 * 获取或初始化客户端密钥
 * @returns {string} 客户端密钥
 */
const getOrInitKey = () => {
  let k = getKey('openid') || getKey('key')
  if (!k) {
    const str = utils.randomString(
      16,
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    )
    k = hexMD5(base64Encode(str))
    setKey('key', k)
  }
  return k
}

/**
 * HTTP请求类
 * 统一处理请求签名、加载状态和错误处理
 */
class Http {
  constructor() {
    this.key = getOrInitKey()
  }

  /**
   * 统一请求方法
   * @param {Object} options - 请求配置
   * @param {string} options.url - 请求URL
   * @param {string} [options.method='GET'] - 请求方法
   * @param {Object} [options.data={}] - 请求数据
   * @param {boolean} [options.showLoading=true] - 是否显示加载提示
   * @returns {Promise} 请求Promise
   */
  request(options) {
    const { url, data = {}, showLoading = true } = options

    // 处理签名
    const signedData = utils.signData(url, { ...data }, this.key)

    // 显示加载提示
    if (showLoading) {
      uni.showLoading({
        mask: true,
        title: '努力加载中...',
      })
    }

    return new Promise((resolve, reject) => {
      // 构建完整URL（所有参数都在查询字符串中）
      const fullUrl = CONFIG.baseURL + url + '?' + utils.buildQueryString(signedData)

      uni.request({
        url: fullUrl,
        method: 'GET', // 统一使用GET方法
        timeout: CONFIG.timeout,
        success: (res) => {
          const { data: responseData } = res

          // 处理静态资源请求
          if (url.startsWith('static')) {
            resolve(responseData)
            return
          }

          // 处理业务错误
          if (responseData.code !== 0) {
            // 特殊错误码处理
            if (responseData.code === -3) {
              emit('showPassword')
            }
            reject(responseData)
            return
          }

          resolve(responseData.data)
        },
        fail: (error) => {
          reject(error)
        },
        complete: () => {
          if (showLoading) {
            uni.hideLoading()
          }
        },
      })
    })
  }

  /**
   * GET请求方法
   * @param {string} url - 请求URL
   * @param {Object} [data={}] - 请求参数
   * @param {Object} [options={}] - 其他配置选项
   * @returns {Promise} 请求Promise
   */
  get(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'GET',
      data,
      ...options,
    })
  }

  /**
   * POST请求方法（实际使用GET）
   * 保留此方法是为了保持API接口的语义化
   * @param {string} url - 请求URL
   * @param {Object} [data={}] - 请求参数
   * @param {Object} [options={}] - 其他配置选项
   * @returns {Promise} 请求Promise
   */
  post(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'GET',
      data,
      ...options,
    })
  }
}

// 导出HTTP请求实例
export default new Http()
