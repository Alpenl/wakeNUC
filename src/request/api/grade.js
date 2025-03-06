import api from '../api'
import { getKey, setKey } from '@/utils/storage'

/**
 * 成绩服务模块
 * 处理成绩相关的 API 请求和数据处理
 */
const grade = {
  /**
   * 获取成绩信息
   * @param {Object} [params] - 请求参数（可选，如果不传则从缓存获取）
   * @param {string} [params.name] - 用户名
   * @param {string} [params.passwd] - 密码
   * @returns {Promise<Object>} 成绩数据和状态
   * @throws {Error} 获取成绩失败时抛出错误
   */
  async getGrades(params) {
    try {
      // 如果没有传入参数，尝试从loginInfo获取
      if (!params) {
        const loginInfo = getKey('loginInfo')
        if (!loginInfo?.username || !loginInfo?.password) {
          // 未登录情况下，尝试从缓存获取数据
          const cachedData = this.getGradesFromCache()
          if (cachedData) {
            return {
              code: 0,
              data: cachedData,
              msg: '从缓存获取成功',
            }
          }
          throw new Error('请先登录')
        }
        params = {
          name: loginInfo.username,
          passwd: loginInfo.password,
        }
      }

      // 发起成绩请求
      const response = await api.education.getGrades(params)

      // 验证响应数据
      if (!response || !Array.isArray(response) || !response.length) {
        throw new Error('获取成绩失败：数据格式错误')
      }

      // 缓存成绩数据
      this.setGradesCache(response)

      // 显示成功提示
      uni.showToast({
        title: '获取成功',
        icon: 'success',
        duration: 1200,
      })

      return {
        code: 0,
        data: response,
        msg: '获取成功',
      }
    } catch (error) {
      // 错误处理
      const errorMsg = error.message || '请求异常'

      // 显示错误提示
      uni.showToast({
        title: errorMsg,
        icon: 'error',
        duration: 1200,
      })

      // 未登录错误特殊处理
      if (errorMsg === '请先登录') {
        uni.showModal({
          title: '未登录',
          content: '跳转到登录页面，或者以游客身份浏览',
          cancelText: '游客',
          cancelColor: '#03a6ff',
          confirmText: '去登陆',
          confirmColor: '#79bd9a',
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/my/login/login',
              })
            } else {
              setKey('name', 'guest')
              setKey('password', 'guest')
            }
          },
        })
      }

      const customError = new Error(errorMsg)
      customError.code = -1
      customError.data = null
      throw customError
    }
  },

  /**
   * 从缓存获取成绩数据
   * @returns {Array|null} 缓存的成绩数据
   */
  getGradesFromCache() {
    return getKey('gradeCache')
  },

  /**
   * 缓存成绩数据
   * @param {Array} data - 成绩数据
   */
  setGradesCache(data) {
    setKey('gradeCache', data)
  },
}

export default grade
