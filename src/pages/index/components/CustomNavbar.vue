<script setup lang="ts">
import { useTimeStore } from '@/store/time'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
// 获取胶囊按钮位置信息
const menuButtonInfo = uni.getMenuButtonBoundingClientRect()

// 创建 timeStore 实例
const timeStore = useTimeStore()

// 跳转到关于页面
const navigateToAbout = () => {
  uni.navigateTo({
    url: '/pages/about/about',
  })
}
</script>

<template>
  <view class="navbar bg-white" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <!-- 导航栏主体 -->
    <view class="flex items-center justify-between h-11 px-4">
      <!-- 左侧日期信息 -->
      <view class="flex flex-col justify-center">
        <text class="text-xl font-bold text-gray-800 leading-normal">
          {{ timeStore.getCurrentDateString }}
        </text>
        <view class="flex items-center gap-2 mt-0.5">
          <text class="text-sm font-semibold">第{{ timeStore.getCurrentWeek }}周</text>
          <text class="text-sm font-semibold">{{ timeStore.getWeekIndexMessage }}</text>
        </view>
      </view>

      <!-- 右侧操作区 -->
      <view
        class="menu-button-area"
        :style="{
          width: menuButtonInfo.width + 'px',
          height: menuButtonInfo.height + 'px',
        }"
      >
        <view
          class="settings-icon"
          :style="{
            position: 'absolute',
            right: menuButtonInfo.width * 1.05 + 'px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: menuButtonInfo.height + 'px',
            height: menuButtonInfo.height + 'px',
          }"
          @tap="navigateToAbout"
        >
          <image
            src="@/static/images/shezhi.png"
            mode="aspectFit"
            class="w-1/2 h-1/2"
            :style="{
              margin: menuButtonInfo.height * 0.25 + 'px',
            }"
          />
        </view>
      </view>
    </view>
    <view class="flex flex-row">
      <view class="w-1/12 flex flex-col justify-center">
        <text class="text-center text-sm">{{ timeStore.currentMonth }}</text>
        <text class="text-center text-sm">月</text>
      </view>

      <!-- 日期栏平均分配剩余空间 -->
      <view class="flex flex-1">
        <view
          v-for="(day, index) in timeStore.weekTitle"
          :key="index"
          class="flex-1 flex flex-col items-center py-1 border-r"
        >
          <view class="flex items-baseline mb-0.5">
            <text class="text-center text-base font-semibold">{{ day }}</text>
          </view>
          <view class="text-center text-sm text-gray-500 font-semibold">
            {{ timeStore.currentWeekDayArray[index] }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.navbar {
  @apply border-b border-gray-200 sticky top-0 left-0 right-0 z-50 bg-white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.menu-button-area {
  @apply relative;
}

.settings-icon {
  @apply flex items-center justify-center cursor-pointer;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
}
</style>
