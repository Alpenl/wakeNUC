import api from '../api'
import { getKey, setKey } from '@/utils/storage'

/**
 * 学业信息服务模块
 * 处理学业信息相关的业务逻辑
 */
const academicService = {
  /**
   * 获取学业信息
   * @param {boolean} [forceRefresh=false] - 是否强制刷新数据
   * @returns {Promise<Object>} 学业信息数据和状态
   * @throws {Error} 获取失败时抛出错误
   */
  async getAcademicInfo(forceRefresh = false) {
    try {
      // 获取登录信息
      const loginInfo = getKey('loginInfo')
      if (!loginInfo?.username || !loginInfo?.password) {
        // 未登录情况下，尝试从缓存获取数据
        const cachedData = this.getAcademicInfoFromCache()
        if (cachedData) {
          return {
            code: 0,
            data: cachedData,
            msg: '从缓存获取成功',
          }
        }
        throw new Error('请先登录')
      }

      // 如果不是强制刷新，检查缓存是否可用
      if (!forceRefresh) {
        const cachedData = this.getAcademicInfoFromCache()
        const lastUpdateTime = getKey('academicInfoUpdateTime')
        const now = Date.now()

        // 如果有缓存且未超过1小时，则使用缓存
        if (cachedData && lastUpdateTime && now - lastUpdateTime < 3600000) {
          // 显示成功提示
          uni.showToast({
            title: '获取成功',
            icon: 'success',
            duration: 1200,
          })

          return {
            code: 0,
            data: cachedData,
            msg: '获取成功',
          }
        }
      }

      // 发起请求获取学业信息
      const response = await api.education.getAcademicInfo({
        name: loginInfo.username,
        passwd: loginInfo.password,
      })

      // 验证响应数据
      if (!Array.isArray(response)) {
        throw new Error('获取学业信息失败：数据格式错误')
      }

      // 更新缓存
      this.setAcademicInfoCache(response)
      setKey('academicInfoUpdateTime', Date.now())

      // 显示成功提示
      uni.showToast({
        title: forceRefresh ? '刷新成功' : '获取成功',
        icon: 'success',
        duration: 1200,
      })

      return {
        code: 0,
        data: response,
        msg: forceRefresh ? '刷新成功' : '获取成功',
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
   * 从缓存获取学业信息数据
   * @returns {Array|null} 缓存的学业信息数据
   */
  getAcademicInfoFromCache() {
    return getKey('academicInfoCache')
  },

  /**
   * 缓存学业信息数据
   * @param {Array} data - 学业信息数据
   */
  setAcademicInfoCache(data) {
    setKey('academicInfoCache', data)
  },

  /**
   * 格式化学业信息数据
   * @param {Array} data - 原始学业信息数据
   * @returns {Array} 格式化后的学业信息数据
   */
  formatAcademicData(data) {
    return [
      { name: '必修', gpa: data[0]?.gpa || '-', xf: data[0]?.xf || '-' },
      { name: '任选', gpa: '-', xf: data[1]?.xf || '-' },
      { name: '所有课程平均GPA', gpa: data[2]?.gpa || '-', xf: '-' },
    ]
  },
}

export default academicService
