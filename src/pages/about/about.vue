<route lang="json5">
{
  style: {
    navigationBarTitleText: '关于',
    navigationStyle: 'custom',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark',
  },
}
</route>

<template>
  <view class="min-h-100vh bg-#f8f9fc">
    <!-- 使用自定义导航栏组件 -->
    <custom-nav-bar title="关于" @back="handleBack" />

    <!-- 页面主体内容 -->
    <view
      class="box-border min-h-100vh p-20rpx"
      :style="{ paddingTop: `calc(${statusBarHeight}px + 44px + 20rpx)` }"
    >
      <!-- 使用登录组件 -->
      <login-form v-if="!isLoggedIn" @login-success="handleLoginSuccess" />

      <!-- 登录后显示内容 -->
      <template v-else>
        <!-- 个人信息卡片 -->
        <view class="my-20rpx mb-50rpx">
          <view
            class="relative p-48rpx overflow-hidden rounded-32rpx shadow-lg profile-card-gradient"
          >
            <view
              class="absolute top--100rpx right--100rpx w-400rpx h-400rpx rounded-50% bg-radial-gradient"
            ></view>
            <view class="relative z-1 flex items-center">
              <view class="relative p-6rpx bg-white/20 rounded-50%">
                <image
                  class="w-140rpx h-140rpx border-4rpx border-white/90 rounded-50% transition-transform duration-300 ease"
                  :src="defaultAvatar"
                  mode="aspectFill"
                />
                <view
                  class="absolute right-6rpx bottom-6rpx w-24rpx h-24rpx bg-#4caf50 border-4rpx border-white rounded-50% shadow-sm"
                ></view>
              </view>
              <view class="ml-40rpx">
                <text
                  class="block mb-16rpx text-48rpx font-600 text-white text-shadow-sm tracking-2rpx"
                >
                  {{ loginInfo.username }}
                </text>
                <view
                  class="inline-flex items-center px-20rpx py-8rpx text-24rpx text-white bg-white/15 backdrop-blur-10px border-2rpx border-white/30 rounded-30rpx"
                >
                  <view class="w-12rpx h-12rpx mr-12rpx bg-white rounded-50%"></view>
                  <text>在校学生</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 功能模块区域 -->
        <view class="grid grid-cols-2 gap-24rpx px-10rpx my-30rpx">
          <view
            v-for="(item, index) in functionList"
            :key="index"
            class="flex flex-col items-center justify-center py-40rpx px-20rpx bg-white rounded-24rpx shadow-sm transition-all duration-300 ease"
            hover-class="shadow-xs transform-translate-y-2rpx"
            @click="handleFunctionClick(item.type)"
          >
            <view
              class="flex items-center justify-center w-80rpx h-80rpx mb-16rpx bg-#7f7fd5/10 rounded-20rpx"
            >
              <image :src="item.icon" class="w-48rpx h-48rpx" mode="aspectFit" />
            </view>
            <text class="text-28rpx font-500 text-#666">{{ item.name }}</text>
          </view>
        </view>

        <!-- 底部列表 -->
        <view class="mx-10rpx my-30rpx bg-white rounded-24rpx shadow-sm overflow-hidden">
          <view
            v-for="(item, index) in bottomList"
            :key="index"
            class="flex items-center justify-between py-32rpx px-24rpx bg-white border-b border-#7f7fd5/10 transition-colors duration-300 ease"
            :class="{ 'text-#ff6b6b': item.type === 'logout' }"
            hover-class="bg-#7f7fd5/5"
            @click="handleBottomItemClick(item.type)"
          >
            <text
              class="text-28rpx font-500"
              :class="item.type === 'logout' ? 'text-#ff6b6b' : 'text-#666'"
            >
              {{ item.name }}
            </text>
            <uni-icons
              :type="item.type === 'logout' ? 'closeempty' : 'right'"
              size="16"
              :color="item.type === 'logout' ? '#ff6b6b' : '#86a8e7'"
            />
          </view>
        </view>
      </template>
    </view>

    <!-- 加载状态 -->
    <view
      v-if="loading"
      class="fixed inset-0 z-999 flex items-center justify-center bg-white/90 backdrop-blur-5px"
    >
      <view
        class="flex flex-col items-center py-30rpx px-50rpx bg-#7f7fd5/95 rounded-20rpx shadow-md"
      >
        <view
          class="w-40rpx h-40rpx mb-16rpx border-3rpx border-white border-t-transparent rounded-50% animate-spin"
        ></view>
        <text class="text-28rpx text-white">加载中...</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getKey, setKey } from '@/utils/storage'
import LoginForm from '@/components/LoginForm.vue'
import CustomNavBar from '@/components/CustomNavBar.vue'
import { useTimeStore } from '@/store/timeStore'
import { getWindowInfoSafe } from '@/utils/system'

const timeStore = useTimeStore()
const username = ref('')
const password = ref('')
const loading = ref(false)
const loginInfo = ref(getKey('loginInfo') || {})
const defaultAvatar = ref('https://20021217.xyz/Alpen.ava.png')
const isLoggedIn = computed(() => !!loginInfo.value.username)

// 获取状态栏高度
const statusBarHeight = ref(20)
// 导航栏内容高度（不包括状态栏）
const contentHeight = 44
// 总的导航栏高度
const navBarHeight = computed(() => statusBarHeight.value + contentHeight)

// 在组件挂载时获取系统信息
onMounted(() => {
  try {
    // 使用新的安全API获取窗口信息
    const windowInfo = getWindowInfoSafe()
    statusBarHeight.value = windowInfo.statusBarHeight || 20

    // #ifdef MP-WEIXIN
    // 获取本地永久存储的头像路径
    const savedAvatarPath = uni.getStorageSync('savedAvatarPath')
    if (savedAvatarPath) {
      const fs = uni.getFileSystemManager()
      fs.access({
        path: savedAvatarPath,
        success: () => {
          defaultAvatar.value = savedAvatarPath
        },
        fail: () => {
          downloadAndSaveAvatar()
        },
      })
    } else {
      downloadAndSaveAvatar()
    }
    // #endif
  } catch (error) {
    console.error('获取系统信息失败:', error)
    statusBarHeight.value = 20 // 使用默认值
  }
})

// 下载并永久保存头像
const downloadAndSaveAvatar = () => {
  // #ifdef MP-WEIXIN
  uni.downloadFile({
    url: defaultAvatar.value,
    success: (res) => {
      if (res.statusCode === 200) {
        // 使用文件系统管理器保存文件
        const fs = uni.getFileSystemManager()
        fs.saveFile({
          tempFilePath: res.tempFilePath,
          success: (saveRes) => {
            uni.setStorageSync('savedAvatarPath', saveRes.savedFilePath)
            defaultAvatar.value = saveRes.savedFilePath
          },
          fail: (err) => {
            console.error('保存头像失败:', err)
          },
        })
      }
    },
    fail: (err) => {
      console.error('下载头像失败:', err)
    },
  })
  // #endif
}

// 修改图标类型定义
interface FunctionItem {
  icon: string
  name: string
  type: string
  url: string
}

const functionList = ref<FunctionItem[]>([
  {
    icon: '/static/images/考试查询.png',
    name: '考试查询',
    type: 'exam',
    url: '/pages/about/components/ExamInfo',
  },
  {
    icon: '/static/images/学业信息.png',
    name: '学业信息',
    type: 'academic',
    url: '/pages/about/components/AcademicInfo',
  },
  {
    icon: '/static/images/我的成绩.png',
    name: '我的成绩',
    type: 'grade',
    url: '/pages/about/components/GradeInfo',
  },
  {
    icon: '/static/images/空闲教室.png',
    name: '空闲教室',
    type: 'classroom',
    url: '/pages/about/components/ClassroomInfo',
  },
])

const bottomList = ref([
  { name: '用户协议', type: 'agreement' },
  { name: '开源说明', type: 'opensource' },
  { name: '版本信息', type: 'version' },
  { name: '退出登录', type: 'logout' },
])

// 处理登录成功
const handleLoginSuccess = (info) => {
  loginInfo.value = info
}

const handleFunctionClick = (type: string) => {
  const item = functionList.value.find((item) => item.type === type)
  if (item) {
    uni.navigateTo({
      url: item.url,
      fail: (err) => {
        console.error('页面跳转失败:', err)
        uni.showToast({
          title: '页面跳转失败',
          icon: 'none',
        })
      },
    })
  }
}

const handleBottomItemClick = (type: string) => {
  if (type === 'logout') {
    setKey('loginInfo', {})
    loginInfo.value = {}

    // #ifdef MP-WEIXIN
    // 获取已保存的头像路径
    const savedAvatarPath = uni.getStorageSync('savedAvatarPath')
    if (savedAvatarPath) {
      // 删除永久文件
      uni.removeSavedFile({
        filePath: savedAvatarPath,
        complete: () => {
          uni.removeStorageSync('savedAvatarPath')
          defaultAvatar.value = 'https://20021217.xyz/Alpen.ava.png'
        },
      })
    }
    // #endif

    uni.showToast({
      title: '已退出登录',
      icon: 'success',
    })
  } else {
    // 根据类型跳转到对应页面
    const pageMap = {
      agreement: '/pages/about/components/Agreement',
      opensource: '/pages/about/components/OpenSource',
      version: '/pages/about/components/Version',
    }

    const url = pageMap[type]
    if (url) {
      uni.navigateTo({
        url,
        fail: (err) => {
          console.error('页面跳转失败:', err)
          uni.showToast({
            title: '页面跳转失败',
            icon: 'none',
          })
        },
      })
    }
  }
}

const handleBack = () => {
  uni.navigateBack({
    delta: 1,
  })
}

// 在 setup 中添加新的响应式变量
// 修复 linter 错误，正确使用 getCurrentWeek getter
const currentWeek = computed(() => timeStore.getCurrentWeek)
const totalCourses = computed(() => timeStore.courseList.length)
const todayCourses = computed(() => {
  const today = new Date().getDay() || 7
  return timeStore.courseList.filter((course) => course.dayOfWeek === today).length
})
</script>

<style>
/* 自定义动画 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
/* 自定义背景渐变 - 无法直接用原子类表示的样式 */
.bg-radial-gradient {
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
}
/* 个人信息卡片渐变背景 */
.profile-card-gradient {
  background: linear-gradient(135deg, #7f7fd5, #86a8e7, #91eae4);
  box-shadow: 0 8rpx 32rpx rgba(127, 127, 213, 0.2);
}
</style>
