<template>
  <view
    class="fixed top-0 right-0 left-0 z-50 bg-gradient-to-r from-#7f7fd5 to-#86a8e7 shadow-sm"
    :style="{ paddingTop: `${statusBarHeight}px` }"
  >
    <view class="relative flex items-center justify-between h-44px px-15px">
      <!-- 返回按钮 -->
      <view v-if="showBack" class="nav-back-btn" @click="handleBack">
        <view class="nav-back-icon"></view>
      </view>
      <view v-else class="w-44px h-44px"></view>

      <!-- 标题 -->
      <text
        class="absolute right-0 left-0 text-center text-17px font-500 text-white pointer-events-none"
      >
        {{ title }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getWindowInfoSafe } from '@/utils/system'

// 定义组件属性
const props = defineProps({
  /**
   * 导航栏标题
   */
  title: {
    type: String,
    required: true,
  },
  /**
   * 是否显示返回按钮
   */
  showBack: {
    type: Boolean,
    default: true,
  },
  /**
   * 返回按钮点击时的回退层级
   */
  delta: {
    type: Number,
    default: 1,
  },
})

// 状态栏高度
const statusBarHeight = ref(20)

// 返回按钮处理函数
const handleBack = () => {
  if (!props.showBack) return

  uni.navigateBack({
    delta: props.delta,
    fail: () => {
      uni.switchTab({
        url: '/pages/index/index',
      })
    },
  })
}

// 获取系统信息
onMounted(() => {
  // 使用新的安全API获取窗口信息
  const windowInfo = getWindowInfoSafe()
  statusBarHeight.value = windowInfo.statusBarHeight || 20
})
</script>

<style>
/* 导航栏样式 */
.nav-back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
}

.nav-back-icon {
  width: 12px;
  height: 12px;
  border-bottom: 2px solid #fff;
  border-left: 2px solid #fff;
  transform: rotate(45deg);
}
</style>
