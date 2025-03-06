<route lang="json5">
{
  style: {
    navigationBarTitleText: '版本信息',
    navigationStyle: 'custom',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark',
  },
}
</route>

<template>
  <view class="min-h-100vh bg-#f8f9fc">
    <!-- 使用自定义导航栏组件 -->
    <custom-nav-bar title="版本信息" @back="handleBack" />

    <!-- 主体内容，添加上边距以避免被导航栏遮挡 -->
    <view class="box-border" :style="{ paddingTop: `calc(${statusBarHeight}px + 44px)` }">
      <view class="content">
        <view class="version-info">
          <view class="version-number">v1.0.0</view>
          <view class="update-time">更新时间：2024-03-21</view>
        </view>
        <view class="update-history">
          <view class="title">更新历史</view>
          <view class="update-list">
            <view class="update-item">
              <view class="version">v1.0.0</view>
              <view class="update-content">
                <view class="update-text">- 首次发布</view>
                <view class="update-text">- 完善课程表查询，可查询实验课程</view>
                <view class="update-text">- 支持学业信息查询</view>
                <view class="update-text">- 支持我的成绩查询</view>
              </view>
            </view>
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
.container {
  min-height: 100vh;
  padding: 30rpx;
  background-color: #f5f6fa;
}

.content {
  padding: 40rpx;
  background-color: #fff;
  border-radius: 20rpx;
}

.version-info {
  padding: 40rpx 0;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.version-number {
  margin-bottom: 20rpx;
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
}

.update-time {
  font-size: 24rpx;
  color: #999;
}

.update-history {
  margin-top: 40rpx;
}

.title {
  margin-bottom: 30rpx;
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}

.update-item {
  margin-bottom: 30rpx;
}

.version {
  margin-bottom: 20rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.update-text {
  margin-bottom: 10rpx;
  font-size: 26rpx;
  line-height: 1.6;
  color: #666;
}
</style>
