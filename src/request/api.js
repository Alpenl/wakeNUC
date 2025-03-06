import http from './http'

/**
 * API接口管理
 * 按功能模块划分，统一管理所有接口
 */
const api = {
  /**
   * 用户模块接口
   * 包含登录、用户信息等接口
   */
  user: {
    /**
     * 用户登录
     * @param {Object} data - 登录参数
     * @param {string} data.name - 用户名
     * @param {string} data.passwd - 密码
     * @returns {Promise} 登录结果
     */
    login: (data) => http.get('v3/login', data),

    /**
     * 获取用户信息
     * @returns {Promise} 用户信息
     */
    getUserInfo: () => http.get('user/info'),
  },

  /**
   * 教务系统模块接口
   * 包含课表、成绩等教务相关接口
   */
  education: {
    /**
     * 获取课表信息
     * @param {Object} data - 课表查询参数
     * @param {string} data.name - 用户名
     * @param {string} data.passwd - 密码
     * @returns {Promise} 课表数据
     */
    getTimetable: (data) => http.get('v3/timetable', data),

    /**
     * 获取成绩信息
     * @param {Object} data - 成绩查询参数
     * @param {string} data.name - 用户名
     * @param {string} data.passwd - 密码
     * @returns {Promise} 成绩数据
     */
    getGrades: (data) => http.get('v3/grade', data),

    /**
     * 获取学业信息
     * @param {Object} data - 学业信息查询参数
     * @param {string} data.name - 用户名
     * @param {string} data.passwd - 密码
     * @returns {Promise} 学业信息数据
     */
    getAcademicInfo: (data) => http.get('v3/studies', data),
  },

  /**
   * 系统模块接口
   * 包含系统配置相关接口
   */
  system: {
    /**
     * 获取系统配置
     * @returns {Promise} 系统配置
     */
    getConfig: () => http.get('system/config'),

    /**
     * 更新系统配置
     * @param {Object} data - 配置参数
     * @returns {Promise} 更新结果
     */
    updateConfig: (data) => http.get('system/config/update', data),
  },
}

export default api
