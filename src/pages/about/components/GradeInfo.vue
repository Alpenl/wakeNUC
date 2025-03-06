<route lang="json5">
{
  style: {
    navigationBarTitleText: '我的成绩',
    navigationStyle: 'custom',
  },
}
</route>

<template>
  <view class="min-h-100vh bg-#f8f9fc">
    <!-- 使用自定义导航栏组件 -->
    <custom-nav-bar title="我的成绩" @back="handleBack" />

    <!-- 使用下拉刷新包装器 -->
    <pull-refresh-wrapper
      :container-style="{
        height: `calc(100vh - ${statusBarHeight}px - 44px)`,
        marginTop: `calc(${statusBarHeight}px + 44px)`,
      }"
      :on-refresh-callback="getGrades"
    >
      <!-- 页面内容区域 -->
      <view class="box-border px-24rpx pt-24rpx">
        <!-- 学期选择区域 - 使用渐变背景 -->
        <view class="p-24rpx mb-24rpx bg-white rounded-20rpx shadow-md overflow-hidden">
          <!-- 学年选择 -->
          <view class="flex justify-center gap-16rpx mb-20rpx">
            <view
              v-for="(year, index) in yearNames"
              :key="index"
              class="px-32rpx py-14rpx text-28rpx text-#666 border border-#e4e7ed rounded-32rpx transition-all duration-250 ease-in-out"
              :class="{
                'font-500 text-white bg-gradient-to-r from-#7f7fd5 to-#86a8e7 border-transparent shadow-sm':
                  yearIndex === index,
                'hover:bg-#f0f2f5 active:bg-#e4e7ed': yearIndex !== index,
              }"
              @click="onYearClick(index)"
            >
              {{ year }}
            </view>
          </view>

          <!-- 学期选择 -->
          <view class="flex justify-center gap-16rpx">
            <view
              v-for="(semester, index) in semesterNames"
              :key="index"
              class="px-32rpx py-14rpx text-28rpx text-#666 border border-#e4e7ed rounded-32rpx transition-all duration-250 ease-in-out"
              :class="{
                'font-500 text-white bg-gradient-to-r from-#7f7fd5 to-#86a8e7 border-transparent shadow-sm':
                  semesterIndex === index,
                'hover:bg-#f0f2f5 active:bg-#e4e7ed': semesterIndex !== index,
              }"
              @click="onSemesterClick(index)"
            >
              {{ semester }}
            </view>
          </view>
        </view>

        <!-- 成绩列表区域 -->
        <view class="flex flex-col flex-1 overflow-hidden bg-white rounded-20rpx shadow-md">
          <!-- 表头 - 使用渐变背景 -->
          <view
            class="flex items-center p-24rpx text-28rpx font-600 text-white bg-gradient-to-r from-#7f7fd5 to-#86a8e7 rounded-t-20rpx"
          >
            <view class="w-[50%] pl-20rpx">{{ tableHeaders[0].text }}</view>
            <view class="w-[16.67%] text-center">{{ tableHeaders[1].text }}</view>
            <view class="w-[16.67%] text-center">{{ tableHeaders[2].text }}</view>
            <view class="w-[16.67%] text-center">{{ tableHeaders[3].text }}</view>
          </view>

          <!-- 表格内容区域 -->
          <view class="flex-1">
            <!-- 空状态 -->
            <view
              v-if="currentGrades.length === 0"
              class="flex flex-col items-center justify-center py-120rpx"
            >
              <uni-icons type="info" size="64" color="#86a8e7" />
              <text class="mt-20rpx text-28rpx text-#909399">暂无成绩数据</text>
            </view>

            <!-- 成绩列表 -->
            <template v-else>
              <view
                v-for="(item, index) in currentGrades"
                :key="index"
                class="flex items-center py-32rpx border-b border-#f0f2f5 transition-all duration-250 ease hover:bg-#fafafa"
                :class="{ 'bg-#f8f9fc': index % 2 === 0 }"
              >
                <view class="w-[50%] pl-20rpx pr-10rpx text-28rpx font-500 text-#303133 truncate">
                  {{ item.name }}
                </view>
                <view class="w-[16.67%] text-center text-28rpx text-#606266">
                  {{ item.credit || '-' }}
                </view>
                <view class="w-[16.67%] text-center text-28rpx text-#606266">
                  {{ item.gradePoint }}
                </view>
                <view class="w-[16.67%] text-center font-500 relative">
                  <text :class="getScoreClass(item.grade)">{{ item.grade || '-' }}</text>
                  <view
                    v-if="item.grade"
                    class="absolute bottom--4rpx left-1/2 w-24rpx h-4rpx rounded-2rpx transform -translate-x-1/2"
                    :class="getScoreIndicatorClass(item.grade)"
                  ></view>
                </view>
              </view>

              <!-- 学期统计信息 -->
              <view class="mt-auto bg-white rounded-t-20rpx shadow-sm">
                <view class="px-20rpx">
                  <!-- 学期平均绩点 -->
                  <view class="flex justify-between items-center py-20rpx">
                    <text class="text-28rpx text-#606266">学期平均绩点</text>
                    <text class="text-28rpx font-500 text-#303133">{{ getSemesterGPA() }}</text>
                  </view>
                  <!-- 总平均绩点 -->
                  <view class="flex justify-between items-center py-20rpx">
                    <text class="text-28rpx text-#606266">总平均绩点</text>
                    <text class="text-28rpx font-500 text-#303133">{{ getTotalGPA() }}</text>
                  </view>
                </view>
                <!-- 底部指示器 -->
                <view class="flex justify-center py-10rpx">
                  <view class="w-60rpx h-6rpx bg-#e0e0e0 rounded-4rpx"></view>
                </view>
              </view>
            </template>
          </view>
        </view>
      </view>
    </pull-refresh-wrapper>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/utils/api'
import { getKey } from '@/utils/storage'
import CustomNavBar from '@/components/CustomNavBar.vue'
import PullRefreshWrapper from '@/components/PullRefreshWrapper.vue'
import grade from '@/request/api/grade'

// 常量定义
const yearNames = ['大一', '大二', '大三', '大四']
const semesterNames = ['上学期', '下学期']
const tableHeaders = [
  { text: '课程名', class: 'course' },
  { text: '学分', class: 'credit' },
  { text: '绩点', class: 'point' },
  { text: '成绩', class: 'score' },
]

// 响应式数据
const yearIndex = ref(0)
const semesterIndex = ref(0)
const gradeData = ref([])
const statusBarHeight = ref(20)
const loading = ref(false)
const refreshing = ref(false)
const error = ref(false)
const errorMessage = ref('')

// 计算当前学期成绩
const currentGrades = computed(() => {
  const index = yearIndex.value * 2 + semesterIndex.value
  return gradeData.value[index] || []
})

// 获取成绩数据
const getGrades = async () => {
  loading.value = true
  error.value = false
  errorMessage.value = ''

  try {
    const response = await grade.getGrades()
    gradeData.value = response.data
  } catch (err) {
    error.value = true
    errorMessage.value = err.message
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

// 切换学年和学期
const onYearClick = (index) => (yearIndex.value = index)
const onSemesterClick = (index) => (semesterIndex.value = index)

// 处理返回按钮点击
const handleBack = () => {
  uni.navigateBack({
    delta: 1,
  })
}

// 获取成绩颜色样式
const getScoreClass = (score) => {
  if (!score) return 'text-#909399'
  const numScore = parseFloat(score)
  if (isNaN(numScore)) return 'text-#606266'

  if (numScore >= 90) return 'text-#67c23a font-600' // 优秀
  if (numScore >= 80) return 'text-#409eff font-600' // 良好
  if (numScore >= 70) return 'text-#606266 font-600' // 中等
  if (numScore >= 60) return 'text-#e6a23c font-600' // 及格
  return 'text-#f56c6c font-600' // 不及格
}

// 获取成绩指示器颜色
const getScoreIndicatorClass = (score) => {
  if (!score) return 'bg-#909399'
  const numScore = parseFloat(score)
  if (isNaN(numScore)) return 'bg-#606266'

  if (numScore >= 90) return 'bg-#67c23a'
  if (numScore >= 80) return 'bg-#409eff'
  if (numScore >= 70) return 'bg-#606266'
  if (numScore >= 60) return 'bg-#e6a23c'
  return 'bg-#f56c6c'
}

// 计算学期平均绩点
const getSemesterGPA = () => {
  if (currentGrades.value.length === 0) return '-'

  // 查找学期平均绩点项
  const gpaItem = currentGrades.value.find(
    (item) => item.name === '学期平均绩点' || item.name.includes('平均绩点'),
  )

  return gpaItem ? gpaItem.gradePoint : '-'
}

// 计算总平均绩点
const getTotalGPA = () => {
  if (gradeData.value.length === 0) return '-'

  // 尝试从所有学期中找到总平均绩点
  for (const semester of gradeData.value) {
    const totalGPA = semester.find(
      (item) => item.name === '总平均绩点' || item.name.includes('总平均'),
    )
    if (totalGPA) return totalGPA.gradePoint
  }

  return '-'
}

// 初始化函数
const init = () => {
  const cache = grade.getGradesFromCache()
  if (cache) {
    gradeData.value = cache
    // 自动定位到最新学期
    const totalSemesters = cache.length
    if (totalSemesters > 0) {
      yearIndex.value = Math.floor((totalSemesters - 1) / 2)
      semesterIndex.value = (totalSemesters - 1) % 2
    }
  } else {
    getGrades()
  }
}

// 在组件挂载时获取系统信息
onMounted(() => {
  // #ifdef MP-WEIXIN
  try {
    // 替换废弃的 getSystemInfoSync 为推荐的新 API
    const windowInfo = uni.getWindowInfo()
    statusBarHeight.value = windowInfo.statusBarHeight || 20
  } catch (error) {
    console.error('获取系统信息失败:', error)
  }
  // #endif

  // #ifndef MP-WEIXIN
  try {
    // 非微信小程序环境也使用新的 API
    const windowInfo = uni.getWindowInfo()
    statusBarHeight.value = windowInfo.statusBarHeight || 20
  } catch (error) {
    console.error('获取系统信息失败:', error)
  }
  // #endif

  init()
})
</script>

<style>
/* 自定义动画 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
