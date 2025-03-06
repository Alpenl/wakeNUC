<route lang="json5">
{
  style: {
    navigationBarTitleText: '开源说明',
    navigationStyle: 'custom',
  },
}
</route>

<template>
  <view class="min-h-100vh bg-#f5f6fa">
    <!-- 使用自定义导航栏组件 -->
    <custom-nav-bar title="开源说明" @back="handleBack" />

    <!-- 页面内容区域 -->
    <view
      class="box-border p-30rpx"
      :style="{ paddingTop: `calc(${statusBarHeight}px + 44px + 30rpx)` }"
    >
      <view class="p-40rpx bg-white rounded-20rpx shadow-sm">
        <view class="mb-30rpx text-36rpx font-bold text-#333">开源说明</view>
        <view>
          <view class="mb-20rpx text-28rpx leading-1.6 text-#666">
            本项目采用开源方式开发，遵循 MIT 开源协议。
          </view>

          <view class="mt-30rpx mb-20rpx text-32rpx font-500 text-#333">主要开源依赖</view>
          <view class="my-20rpx">
            <view class="flex justify-between py-20rpx border-b border-#eee">
              <text class="text-28rpx text-#333">Vue.js</text>
              <text class="text-28rpx text-#666">v3.x</text>
            </view>
            <view class="flex justify-between py-20rpx border-b border-#eee">
              <text class="text-28rpx text-#333">uni-app</text>
              <text class="text-28rpx text-#666">latest</text>
            </view>
            <view class="flex justify-between py-20rpx border-b border-#eee">
              <text class="text-28rpx text-#333">Pinia</text>
              <text class="text-28rpx text-#666">v2.x</text>
            </view>
          </view>

          <view class="mt-30rpx mb-20rpx text-32rpx font-500 text-#333">项目地址</view>
          <view class="mb-20rpx text-28rpx leading-1.6 text-#666">
            GitHub: https://github.com/your-username/your-project
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CustomNavBar from '@/components/CustomNavBar.vue'
import { getWindowInfoSafe } from '@/utils/system'

// 状态栏高度
const statusBarHeight = ref(20)

// 处理返回按钮点击
const handleBack = () => {
  uni.navigateBack({
    delta: 1,
  })
}

// 在组件挂载时获取系统信息
onMounted(() => {
  try {
    const windowInfo = getWindowInfoSafe()
    statusBarHeight.value = windowInfo.statusBarHeight || 20
  } catch (error) {
    console.error('获取系统信息失败:', error)
  }
})
</script>

<style>
/* 使用 Tailwind 类替代自定义样式 */
</style>
