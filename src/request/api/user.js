import api from '../api'
import { setKey } from '@/utils/storage'

/**
 * 用户服务模块
 * 处理用户相关的业务逻辑，包括登录和课表获取
 */
export const userService = {
  /**
   * 用户登录
   * 处理登录请求并保存登录信息
   * @param {Object} params - 登录参数
   * @param {string} params.name - 用户名
   * @param {string} params.passwd - 密码
   * @returns {Promise<Object>} 登录结果和用户信息
   * @throws {Error} 登录失败时抛出错误
   */
  async login(params) {
    try {
      // 发起登录请求
      const result = await api.user.login({
        name: params.name,
        passwd: params.passwd,
      })

      // 保存登录信息到本地存储
      const loginInfo = {
        username: params.name,
        password: params.passwd,
      }
      setKey('loginInfo', loginInfo)

      return { result, loginInfo }
    } catch (error) {
      this.handleError(error, '登录失败')
    }
  },

  /**
   * 获取课表信息
   * 获取并格式化课表数据
   * @param {Object} params - 课表查询参数
   * @param {string} params.name - 用户名
   * @param {string} params.passwd - 密码
   * @returns {Promise<Array>} 格式化后的课表数据
   * @throws {Error} 获取课表失败时抛出错误
   */
  async getTimetable(params) {
    try {
      // 获取原始课表数据
      const responseData = await api.education.getTimetable({
        name: params.name,
        passwd: params.passwd,
      })

      // 验证数据有效性
      if (!responseData || !Array.isArray(responseData) || !responseData.length) {
        throw new Error('获取课表失败：数据为空')
      }

      // 格式化课表数据
      const courses = this.formatTimetableData(responseData)

      // 缓存原始课表数据
      setKey('timetableCache', responseData)

      return courses
    } catch (error) {
      this.handleError(error, '获取课表失败')
    }
  },

  /**
   * 格式化课表数据
   * @param {Array} data - 原始课表数据
   * @returns {Array} 格式化后的课表数据
   */
  formatTimetableData(data) {
    return data.map((course) => ({
      title: course.name || course.title,
      location: course.room || course.location,
      teacherName: course.teacher || course.teacherName,
      dayOfWeek: course.dayOfWeek,
      startPeriods: course.startPeriods,
      endPeriods: course.endPeriods,
      number: course.number,
      weeks: course.weeks || [],
    }))
  },

  /**
   * 统一错误处理
   * @param {Error} error - 错误对象
   * @param {string} defaultMessage - 默认错误信息
   * @throws {Error} 包装后的错误
   */
  handleError(error, defaultMessage) {
    const errorMessage = error.data?.message || error.message || defaultMessage
    const customError = new Error(errorMessage)
    customError.code = error.data?.code || -1
    customError.data = error.data
    throw customError
  },
}

export default userService
