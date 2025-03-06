<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark',
  },
}
</route>
<template>
  <view class="page-container">
    <view class="fixed-navbar" ref="navbarRef">
      <CustomNavbar />
    </view>
    <scroll-view
      scroll-y
      class="pull-refresh-wrapper"
      :style="{ paddingTop: navbarHeight + 'px' }"
      :refresher-enabled="true"
      :refresher-triggered="refreshing"
      @refresherpulling="onPulling"
      @refresherrefresh="onRefresh"
      @refresherrestore="onRestore"
      @refresherabort="onAbort"
    >
      <view class="course-container" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
        <CourseTable ref="courseTableRef" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import CustomNavbar from './components/CustomNavbar.vue'
import CourseTable from './components/CourseTable.vue'
import { useTimeStore } from '@/store/timeStore'
import { ref, onMounted } from 'vue'
import { getKey, setKey } from '@/utils/storage'
import { userService } from '@/request/api/user'

const timeStore = useTimeStore()
const courseTableRef = ref<InstanceType<typeof CourseTable>>()
const navbarRef = ref<HTMLElement | null>(null)
const navbarHeight = ref(80) // 调整默认值为更合理的高度

// 记录触摸起始位置
const touchStartX = ref(0)

// 获取导航栏高度
const getNavbarHeight = () => {
  // 等待DOM渲染完成
  setTimeout(() => {
    const query = uni.createSelectorQuery()
    query
      .select('.fixed-navbar')
      .boundingClientRect((data) => {
        if (data && typeof data === 'object' && 'height' in data) {
          console.log('导航栏高度:', data.height)
          // 直接使用导航栏的实际高度，不添加额外间距
          navbarHeight.value = data.height
        }
      })
      .exec()
  }, 100)
}

// 在页面加载时获取导航栏高度
onMounted(() => {
  getNavbarHeight()

  // 监听窗口大小变化，重新计算导航栏高度
  uni.onWindowResize(() => {
    getNavbarHeight()
  })
})

// 获取课程表数据
const fetchTimetable = async () => {
  // 获取登录信息
  const loginInfo = getKey('loginInfo')

  if (!loginInfo || !loginInfo.username || !loginInfo.password) {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 1500,
    })
    return false
  }

  try {
    // 使用userService获取课表数据
    const courses = await userService.getTimetable({
      name: loginInfo.username,
      passwd: loginInfo.password,
    })

    // 更新课程数据
    timeStore.setCourseList(courses)
    return true
  } catch (error) {
    console.error('获取课表失败:', error)
    uni.showToast({
      title: error.message || '获取课表失败',
      icon: 'none',
      duration: 1500,
    })
    return false
  }
}

// 处理触摸开始事件
const handleTouchStart = (event: TouchEvent) => {
  touchStartX.value = event.touches[0].clientX
}

// 处理触摸结束事件
const handleTouchEnd = (event: TouchEvent) => {
  const touchEndX = event.changedTouches[0].clientX
  const deltaX = touchEndX - touchStartX.value

  // 设置最小滑动距离阈值
  const minSwipeDistance = 50

  if (Math.abs(deltaX) > minSwipeDistance) {
    // 向左滑动（deltaX < 0），显示下一周
    if (deltaX < 0) {
      if (timeStore.currentWeekIndex < timeStore.weekNum) {
        courseTableRef.value?.startSlide(-1)
        timeStore.switchWeek(1)
      } else {
        // 可以添加一个提示或轻微的反弹动画
        uni.showToast({
          title: '已经是最后一周',
          icon: 'none',
          duration: 1500,
        })
      }
    }
    // 向右滑动（deltaX > 0），显示上一周
    else {
      if (timeStore.currentWeekIndex > 1) {
        courseTableRef.value?.startSlide(1)
        timeStore.switchWeek(-1)
      } else {
        // 可以添加一个提示或轻微的反弹动画
        uni.showToast({
          title: '已经是第一周',
          icon: 'none',
          duration: 1500,
        })
      }
    }
  }
}

// 下拉刷新状态
const refreshing = ref(false)

// 下拉中
const onPulling = () => {
  console.log('下拉中...')
}

// 下拉刷新触发
const onRefresh = async () => {
  console.log('下拉刷新触发')
  refreshing.value = true

  try {
    // 显示刷新提示
    uni.showLoading({
      title: '刷新数据中...',
      mask: true,
    })

    // 从后端获取最新课程数据
    const success = await fetchTimetable()

    if (success) {
      // 调用课程表组件的刷新方法
      courseTableRef.value?.refreshCourseData()
      // 显示成功提示
      uni.showToast({
        title: '数据已更新',
        icon: 'success',
        duration: 1500,
      })
    }
  } catch (error) {
    // 显示错误提示
    uni.showToast({
      title: '刷新失败，请稍后再试',
      icon: 'none',
      duration: 1500,
    })
    console.error('刷新数据失败:', error)
  } finally {
    // 隐藏加载提示
    uni.hideLoading()
    // 停止下拉刷新
    refreshing.value = false
  }
}

// 下拉刷新复位
const onRestore = () => {
  console.log('下拉刷新复位')
}

// 下拉刷新被中止
const onAbort = () => {
  console.log('下拉刷新被中止')
  refreshing.value = false
}
</script>

<style scoped>
/* 确保页面容器占满整个视口高度 */
.page-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #fff;
}
/* 固定导航栏样式 */
.fixed-navbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 100;
  background-color: #fff;
}
/* 下拉刷新容器样式 */
.pull-refresh-wrapper {
  position: relative;
  flex: 1;
  width: 100%;
  height: calc(100vh - var(--status-bar-height));
  padding-bottom: 0; /* 确保底部没有额外的内边距 */
  margin-top: 0; /* 确保没有额外的边距 */
  background-color: transparent;
}
/* 课程表容器样式 */
.course-container {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 0; /* 移除可能的内边距 */
  margin: 0; /* 移除可能的边距 */
}
/* 确保滚动区域正确填充容器 */
:deep(.uni-scroll-view) {
  height: 100% !important;
}
/* 确保内容区域正确填充 */
:deep(.uni-scroll-view-content) {
  min-height: 100%;
}
/* 添加触摸反馈效果 */
.touch-feedback {
  transition: transform 0.3s ease;
}

.touch-feedback:active {
  transform: scale(0.98);
}
</style>
