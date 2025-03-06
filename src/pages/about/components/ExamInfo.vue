<route lang="json5">
{
  style: {
    navigationBarTitleText: '考试信息',
    navigationStyle: 'custom',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark',
  },
}
</route>

<template>
  <view class="min-h-100vh bg-#f8f9fc">
    <!-- 使用自定义导航栏组件 -->
    <custom-nav-bar title="考试信息" @back="handleBack" />

    <!-- 主体内容，添加上边距以避免被导航栏遮挡 -->
    <view class="box-border" :style="{ paddingTop: `calc(${statusBarHeight}px + 44px)` }">
      <view class="developing-container">
        <uni-icons type="calendar" size="64" color="#3498db" />
        <text class="developing-text">考试信息查询功能开发中...</text>
        <text class="developing-desc">敬请期待</text>
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

// 返回按钮处理函数
const handleBack = () => {
  uni.navigateBack({
    delta: 1,
    fail: () => {
      uni.switchTab({
        url: '/pages/about/about',
      })
    },
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

<style scoped>
.developing-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx;
  text-align: center;
}

.developing-text {
  margin-top: 30rpx;
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}

.developing-desc {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #666;
}
</style>
