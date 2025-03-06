<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
// import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import { useTimeStore } from '@/store/timeStore'
import { getKey } from '@/utils/storage'

/**
 * App 启动时的初始化函数
 * 主要用于初始化时间管理相关的设置和状态
 */
onLaunch(() => {
  console.log('App Launch')

  try {
    // 获取系统信息
    const systemInfo = getSystemInfo()
    console.log('系统信息:', systemInfo)

    const timeStore = useTimeStore()

    // 获取本地存储的数据
    const localStorageData = {
      key: getKey('key'),
      loginInfo: getKey('loginInfo'),
      timetableCache: getKey('timetableCache'),
    }

    // 初始化时间设置
    const weekIndex = timeStore.initialize('2025-02-17')

    if (localStorageData.timetableCache?.length) {
      const courses = localStorageData.timetableCache.map((course) => ({
        title: course.name || course.title,
        location: course.room || course.location,
        teacherName: course.teacher || course.teacherName,
        dayOfWeek: course.dayOfWeek,
        startPeriods: course.startPeriods,
        endPeriods: course.endPeriods,
        number: course.number,
        weeks: course.weeks || [],
      }))

      timeStore.setCourseList(courses)
    }

    // 使用 console.group 优化日志输出
    console.group('初始化信息')
    console.log('本地存储数据:', localStorageData)
    console.log('时间管理初始化信息:', {
      当前系统日期: timeStore.getCurrentDateString,
      星期信息: timeStore.getWeekMessage,
      当前教学周: weekIndex,
      显示周次: timeStore.getCurrentWeek,
      开学状态: timeStore.$state.isStart ? '已开学' : '未开学',
      当前月份: timeStore.$state.currentMonth + '月',
      作息时间表: timeStore.getTimeList,
      本周日期数组: timeStore.currentWeekDayArray,
      课程总数: timeStore.$state.courseList.length,
      本周课程数: timeStore.weekCourseList.length,
      颜色主题索引: timeStore.$state.colorArrayIndex,
      课程列表: timeStore.$state.courseList,
    })
    console.groupEnd()
  } catch (error) {
    console.error('应用初始化失败:', error)
  }
})

/**
 * App 显示时触发
 * 可用于恢复一些状态或进行必要的更新
 */
onShow(() => {
  console.log('App Show')
})

/**
 * App 隐藏时触发
 * 可用于保存一些状态或清理工作
 */
onHide(() => {
  console.log('App Hide')
})

// 获取系统信息的工具函数
const getSystemInfo = () => {
  // #ifdef MP-WEIXIN
  try {
    // 获取系统信息
    return uni.getSystemInfoSync()
  } catch (error) {
    console.error('获取系统信息失败:', error)
    return null
  }
  // #endif
}
</script>

<style lang="scss">
/* stylelint-disable selector-type-no-unknown */
button::after {
  border: none;
}

swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

// 单行省略，优先使用 unocss: text-ellipsis
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 两行省略
.ellipsis-2 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

// 三行省略
.ellipsis-3 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
