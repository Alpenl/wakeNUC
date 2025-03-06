<script setup lang="ts">
import { useTimeStore } from '@/store/timeStore'
import { computed, ref } from 'vue'

const timeStore = useTimeStore()

// 添加动画相关的状态
const isAnimating = ref(false)
const slideDirection = ref(0) // -1: 向左滑动, 1: 向右滑动
const slideOffset = ref(0)

// 获取当前周的课程列表
const weekCourses = computed(() => {
  // 获取所有课程
  const currentDisplayWeek = timeStore.currentWeekIndex // 当前显示的周次

  // 创建一个Map来跟踪每个位置的课程
  // 使用更精细的位置跟踪，记录每个时间段的占用情况
  const occupiedSlots = new Map()
  // 记录未来课程的时间段占用情况，用于处理未来课程之间的重叠
  const futureCourseSlots = new Map()

  // 首先处理当前周的课程
  const currentWeekCourses = timeStore.courseList.filter((course) =>
    course.weeks.includes(currentDisplayWeek),
  )

  // 将当前周的课程添加到位置映射中，标记所有被占用的时间段
  currentWeekCourses.forEach((course) => {
    const { dayOfWeek, startPeriods, endPeriods } = course
    // 标记该课程占用的所有时间段
    for (let period = startPeriods; period <= endPeriods; period++) {
      const slotKey = `${dayOfWeek}-${period}`
      occupiedSlots.set(slotKey, true)
    }
  })

  // 处理未来周的课程（半透明显示）
  const futureCourses = timeStore.courseList.filter((course) => {
    const firstWeek = Math.min(...course.weeks) // 课程的第一周
    const lastWeek = Math.max(...course.weeks) // 课程的最后一周

    // 如果当前显示的周超过了课程的最后一周，不显示
    if (currentDisplayWeek > lastWeek) {
      return false
    }

    // 如果是当前周的课程，已经在上面处理过了
    if (course.weeks.includes(currentDisplayWeek)) {
      return false
    }

    // 只显示未来的课程（当前周 < 课程的第一周）
    return currentDisplayWeek < firstWeek
  })

  // 按课程长度排序，优先处理较短的课程
  const sortedFutureCourses = [...futureCourses].sort((a, b) => {
    // 计算课程长度（节数）
    const lengthA = a.endPeriods - a.startPeriods + 1
    const lengthB = b.endPeriods - b.startPeriods + 1
    // 长度相同时随机排序
    if (lengthA === lengthB) {
      return Math.random() - 0.5
    }
    // 较短的课程优先
    return lengthA - lengthB
  })

  // 筛选不与当前周课程重叠的未来课程，并处理未来课程之间的重叠
  const additionalCourses = []

  sortedFutureCourses.forEach((course) => {
    const { dayOfWeek, startPeriods, endPeriods } = course
    let hasOverlap = false

    // 检查是否与当前周课程重叠
    for (let period = startPeriods; period <= endPeriods; period++) {
      const slotKey = `${dayOfWeek}-${period}`
      if (occupiedSlots.has(slotKey)) {
        hasOverlap = true
        break
      }
    }

    // 如果与当前周课程没有重叠，再检查是否与已选择的未来课程重叠
    if (!hasOverlap) {
      let overlapWithFutureCourse = false

      for (let period = startPeriods; period <= endPeriods; period++) {
        const slotKey = `${dayOfWeek}-${period}`
        if (futureCourseSlots.has(slotKey)) {
          overlapWithFutureCourse = true
          break
        }
      }

      // 如果没有重叠，则添加到结果中，并标记占用的时间段
      if (!overlapWithFutureCourse) {
        additionalCourses.push(course)

        // 标记该课程占用的所有时间段
        for (let period = startPeriods; period <= endPeriods; period++) {
          const slotKey = `${dayOfWeek}-${period}`
          futureCourseSlots.set(slotKey, true)
        }
      }
    }
  })

  // 合并当前周课程和不重叠的未来课程
  return [...currentWeekCourses, ...additionalCourses]
})

// 处理动画结束
const handleTransitionEnd = () => {
  isAnimating.value = false
  slideOffset.value = 0
  slideDirection.value = 0
}

// 暴露给父组件的滑动方法
const startSlide = (direction: number) => {
  isAnimating.value = true
  slideDirection.value = direction
  // 向左滑动(direction=-1)时，slideOffset为负值(-100%)，内容向左移动
  // 向右滑动(direction=1)时，slideOffset为正值(100%)，内容向右移动
  slideOffset.value = direction * 100
}

// 刷新课程数据
const refreshCourseData = () => {
  console.log('刷新课程表数据')

  // 添加一个轻微的动画效果，提供视觉反馈
  isAnimating.value = true
  slideDirection.value = 0
  slideOffset.value = 5 // 轻微的右移

  setTimeout(() => {
    slideOffset.value = -5 // 轻微的左移

    setTimeout(() => {
      // 重置动画状态
      isAnimating.value = false
      slideOffset.value = 0
      slideDirection.value = 0

      // 重新计算课程列表
      return weekCourses.value
    }, 150)
  }, 150)

  return weekCourses.value
}

// 计算容器的样式
const containerStyle = computed(() => {
  // 直接使用 slideOffset，负值向左移动，正值向右移动
  const transform = isAnimating.value ? `translateX(${slideOffset.value}%)` : 'translateX(0)'

  return {
    transform,
    transition: isAnimating.value ? 'transform 0.3s ease-in-out' : 'none',
  }
})

// 计算课程在表格中的位置和样式
const getCourseStyle = (course) => {
  const top = ((course.startPeriods - 1) * 100) / 12 + '%'
  const height = (course.number * 100) / 12 + '%'
  const gridColumn = `${course.dayOfWeek} / ${course.dayOfWeek + 1}`

  const currentDisplayWeek = timeStore.currentWeekIndex // 当前显示的周次

  // 判断课程状态
  const isInCurrentWeek = course.weeks.includes(currentDisplayWeek) // 是否在当前显示的周
  const firstWeek = Math.min(...course.weeks) // 课程的第一周

  // 如果不是当前周的课程，或者还未到课程开始周，显示半透明
  const shouldBeTransparent = !isInCurrentWeek || currentDisplayWeek < firstWeek

  // 设置z-index，确保当前周的课程显示在未来课程之上
  const zIndex = isInCurrentWeek ? 2 : 1

  return {
    position: 'absolute',
    top,
    height,
    gridColumn,
    backgroundColor: course.color,
    borderRadius: '8px',
    overflow: 'visible',
    boxSizing: 'border-box',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    padding: '4px 6px',
    margin: '1px',
    width: 'calc(100% - 2px)',
    zIndex,
    opacity: shouldBeTransparent ? 0.5 : 1,
  }
}

// 判断某个时间段是否有课程
const hasCourse = (dayOfWeek: number, period: number) => {
  return weekCourses.value.some(
    (course) =>
      course.dayOfWeek === dayOfWeek &&
      period >= course.startPeriods &&
      period <= course.endPeriods,
  )
}

defineExpose({
  startSlide,
  refreshCourseData,
})
</script>

<template>
  <view class="course-table h-180">
    <view class="flex flex-row h-full">
      <!-- 左侧时间栏 -->
      <view class="w-1/12 flex flex-col justify-around items-center">
        <view v-for="period in 12" :key="period" class="time-item flex flex-col items-center">
          <view class="text-base leading-none">{{ period }}</view>
          <view
            class="leading-none font-bold border text-gray-500 rounded-md"
            style="font-size: 0.7rem"
          >
            {{ timeStore.getTimeList[period - 1].s }}
          </view>
          <view
            class="leading-none font-bold border text-gray-500 rounded-md"
            style="font-size: 0.7rem"
          >
            {{ timeStore.getTimeList[period - 1].e }}
          </view>
        </view>
      </view>

      <!-- 右侧课程表 -->
      <view class="course-grid flex-1 relative overflow-hidden">
        <!-- 添加动画容器 -->
        <view
          class="course-container absolute inset-0"
          :style="containerStyle"
          @transitionend="handleTransitionEnd"
        >
          <!-- 背景网格 -->
          <view class="grid grid-cols-7 h-full absolute inset-0">
            <view v-for="day in 7" :key="day" class="grid-line border-r border-gray-200"></view>
          </view>

          <!-- 课程卡片容器 -->
          <view class="grid grid-cols-7 h-full relative">
            <view
              v-for="course in weekCourses"
              :key="course.title + course.dayOfWeek"
              :style="getCourseStyle(course)"
              class="course-item"
            >
              <view class="course-title">{{ course.title }}</view>
              <view class="course-location">@{{ course.location }}</view>
              <view class="course-teacher">{{ course.teacherName }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.course-table,
.time-column,
.course-grid,
.grid-line {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.course-item {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 40px;
  word-break: break-all;
  transition: all 0.3s ease;
}

.course-item > view {
  margin-bottom: 2px;
}

.course-item:hover {
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: scale(1.02) translateY(-1px);
}

.course-title {
  margin-bottom: 2px;
  font-size: 11px;
  font-weight: bold;
  line-height: 1.2;
  color: #333;
}

.course-location {
  margin-bottom: 1px;
  font-size: 11px;
  font-weight: bold;
  line-height: 1.2;
  color: #333;
}

.course-teacher {
  font-size: 11px;
  line-height: 1.2;
  color: #666;
}

.course-grid {
  position: relative;
  overflow: hidden; /* 确保滑动内容不会溢出 */
}

.course-container {
  width: 100%;
  height: 100%;
  will-change: transform; /* 优化动画性能 */
}
</style>
