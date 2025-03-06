<route lang="json5">
{
  style: {
    navigationBarTitleText: '学业信息',
    navigationStyle: 'custom',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark',
  },
}
</route>

<template>
  <view class="min-h-100vh bg-#f8f9fc">
    <!-- 使用自定义导航栏组件 -->
    <custom-nav-bar title="学业信息" @back="handleBack" />

    <!-- 主体内容，添加上边距以避免被导航栏遮挡 -->
    <pull-refresh-wrapper
      :container-style="{ paddingTop: `calc(${statusBarHeight}px + 44px)` }"
      :on-refresh-callback="handleRefresh"
    >
      <!-- 表格布局 -->
      <view class="flex-1 mx-4 my-4 bg-white rounded-3xl shadow-sm overflow-hidden">
        <!-- 加载状态 -->
        <view v-if="loading" class="h-[70vh] flex items-center justify-center">
          <uni-icons type="spinner-cycle" size="32" color="#7f7fd5" />
        </view>

        <!-- 错误状态 -->
        <view v-else-if="error" class="h-[70vh] flex items-center justify-center">
          <view class="flex flex-col items-center">
            <uni-icons type="closeempty" size="64" color="#ff6b6b" />
            <text class="my-6 text-sm text-gray-600">{{ errorMessage }}</text>
            <button
              class="px-15 py-5 text-sm text-white bg-gradient-to-r from-#7f7fd5 to-#86a8e7 rounded-full shadow-md transition-all active:translate-y-0.5 active:shadow-sm"
              @click="fetchAcademicInfo"
            >
              重新加载
            </button>
          </view>
        </view>

        <template v-else>
          <!-- 表头 -->
          <view class="flex w-full bg-gradient-to-r from-[#7f7fd5] to-[#86a8e7]">
            <view class="flex-1 py-4 text-sm font-medium text-white text-center">课程性质名称</view>
            <view class="flex-1 py-4 text-sm font-medium text-white text-center">平均学分绩点</view>
            <view class="flex-1 py-4 text-sm font-medium text-white text-center">获得学分</view>
          </view>

          <!-- 数据行 -->
          <view class="divide-y divide-[#7f7fd5]/10">
            <view v-for="(item, index) in formattedData" :key="index" class="flex w-full">
              <view class="flex-1 py-5 text-sm text-gray-600 text-center">{{ item.name }}</view>
              <view class="flex-1 py-5 text-sm text-gray-600 text-center">{{ item.gpa }}</view>
              <view class="flex-1 py-5 text-sm text-gray-600 text-center">{{ item.xf }}</view>
            </view>
          </view>

          <!-- 底部信息 -->
          <view class="p-4 bg-[#f8f9fc] border-t border-[#7f7fd5]/10">
            <text class="block mb-2 text-xs text-gray-400 text-center">
              最后更新于：{{ formatTime(getNowTime()) }}
            </text>
            <text class="block text-xs text-gray-400 text-center">
              注：数据来源于教务系统，学期平均绩点请前往成绩查询查看
            </text>
          </view>
        </template>
      </view>
    </pull-refresh-wrapper>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CustomNavBar from '@/components/CustomNavBar.vue'
import PullRefreshWrapper from '@/components/PullRefreshWrapper.vue'
import { getWindowInfoSafe } from '@/utils/system'
import academicService from '@/request/api/academic'

// 定义学业信息数据结构
interface AcademicItem {
  name: string // 课程性质名称
  gpa: string // 平均学分绩点
  xf: string // 获得学分
}

// 状态变量
const loading = ref(true)
const error = ref(false)
const errorMessage = ref('')
const academicInfo = ref<any[]>([])

// 格式化数据
const formattedData = computed(() => academicService.formatAcademicData(academicInfo.value))

// 获取当前时间戳
const getNowTime = () => {
  return new Date().getTime()
}

// 格式化时间显示
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
}

// 处理刷新
const handleRefresh = async () => {
  return fetchAcademicInfo(true)
}

// 获取学业信息数据
const fetchAcademicInfo = async (forceRefresh = false) => {
  loading.value = true
  error.value = false

  try {
    const response = await academicService.getAcademicInfo(forceRefresh)
    academicInfo.value = response.data
    loading.value = false
  } catch (err: any) {
    error.value = true
    errorMessage.value = err.message
    loading.value = false
    throw err // 向上传播错误，让PullRefreshWrapper组件处理
  }
}

// 获取状态栏高度
const statusBarHeight = ref(20)
// 导航栏内容高度（不包括状态栏）
const contentHeight = 44
// 总的导航栏高度
const navBarHeight = computed(() => statusBarHeight.value + contentHeight)

// 在组件挂载时获取系统信息
onMounted(() => {
  try {
    const windowInfo = getWindowInfoSafe()
    statusBarHeight.value = windowInfo.statusBarHeight || 20
  } catch (error) {
    console.error('获取系统信息失败:', error)
    statusBarHeight.value = 20 // 使用默认值
  }

  fetchAcademicInfo()
})

// 处理返回按钮点击
const handleBack = () => {
  uni.navigateBack({
    delta: 1,
  })
}
</script>

<style scoped>
/* 移除重复的导航栏样式，使用CustomNavBar组件提供的样式 */
</style>
