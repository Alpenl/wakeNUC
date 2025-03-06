<!-- 
  @description: 下拉刷新包装器组件
  @author: AI Assistant
  @date: 2024-03-06
-->
<template>
  <scroll-view
    scroll-y
    class="pull-refresh-wrapper"
    :style="containerStyle"
    :refresher-enabled="true"
    :refresher-triggered="refreshing"
    @refresherpulling="onPulling"
    @refresherrefresh="onRefresh"
    @refresherrestore="onRestore"
    @refresherabort="onAbort"
  >
    <slot></slot>
  </scroll-view>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'PullRefreshWrapper',
  props: {
    // 容器样式
    containerStyle: {
      type: Object,
      default: () => ({}),
    },
    // 刷新函数
    onRefreshCallback: {
      type: Function,
      required: true,
    },
  },

  setup(props) {
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

        // 调用传入的刷新回调函数
        await props.onRefreshCallback()

        // 显示成功提示
        uni.showToast({
          title: '数据已更新',
          icon: 'success',
          duration: 1500,
        })
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

    return {
      refreshing,
      onPulling,
      onRefresh,
      onRestore,
      onAbort,
    }
  },
}
</script>

<style scoped>
.pull-refresh-wrapper {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: transparent;
}
/* 确保滚动区域正确填充容器 */
:deep(.uni-scroll-view) {
  height: 100% !important;
}
/* 确保内容区域正确填充 */
:deep(.uni-scroll-view-content) {
  min-height: 100%;
}
</style>
