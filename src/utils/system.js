/**
 * 系统信息工具函数
 * 用于替代废弃的 uni.getSystemInfoSync() API
 */

/**
 * 获取窗口信息（状态栏高度等）
 * 替代 uni.getSystemInfoSync() 获取窗口相关信息
 * @returns {object} 窗口信息对象
 */
export function getWindowInfoSafe() {
  try {
    return uni.getWindowInfo()
  } catch (error) {
    console.error('获取窗口信息失败:', error)
    // 返回默认值
    return {
      statusBarHeight: 20,
      screenWidth: 375,
      screenHeight: 667,
      windowWidth: 375,
      windowHeight: 667,
      pixelRatio: 2,
    }
  }
}

/**
 * 获取设备信息（设备型号、品牌等）
 * 替代 uni.getSystemInfoSync() 获取设备相关信息
 * @returns {object} 设备信息对象
 */
export function getDeviceInfoSafe() {
  try {
    return uni.getDeviceInfo()
  } catch (error) {
    console.error('获取设备信息失败:', error)
    // 返回默认值
    return {
      brand: '',
      model: '',
      system: '',
      platform: '',
    }
  }
}

/**
 * 获取应用基础信息（应用版本、语言等）
 * 替代 uni.getSystemInfoSync() 获取应用相关信息
 * @returns {object} 应用基础信息对象
 */
export function getAppBaseInfoSafe() {
  try {
    return uni.getAppBaseInfo()
  } catch (error) {
    console.error('获取应用基础信息失败:', error)
    // 返回默认值
    return {
      appId: '',
      appName: '',
      appVersion: '',
      appVersionCode: '',
      appLanguage: 'zh-Hans',
    }
  }
}

/**
 * 获取完整的系统信息（兼容旧的 getSystemInfoSync 返回格式）
 * 整合窗口、设备、应用基础信息
 * @returns {object} 完整的系统信息对象
 */
export function getSystemInfoSafe() {
  const windowInfo = getWindowInfoSafe()
  const deviceInfo = getDeviceInfoSafe()
  const appBaseInfo = getAppBaseInfoSafe()

  // 合并所有信息，保持与旧 API 返回格式兼容
  return {
    ...windowInfo,
    ...deviceInfo,
    ...appBaseInfo,
    // 添加一些可能需要的计算属性
    safeArea: windowInfo.safeArea || {
      left: 0,
      right: windowInfo.windowWidth,
      top: windowInfo.statusBarHeight,
      bottom: windowInfo.windowHeight,
      width: windowInfo.windowWidth,
      height: windowInfo.windowHeight - windowInfo.statusBarHeight,
    },
  }
}
