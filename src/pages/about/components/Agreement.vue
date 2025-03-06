<route lang="json5">
{
  style: {
    navigationBarTitleText: '用户协议',
    navigationStyle: 'custom',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark',
  },
}
</route>

<template>
  <view class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 自定义导航栏 -->
    <custom-nav-bar title="用户协议" @back="handleBack" />

    <!-- 主体内容区域 -->
    <view class="px-4 py-6 pb-safe" :style="{ paddingTop: `calc(${statusBarHeight}px + 44px)` }">
      <view class="w-full max-w-3xl mx-auto">
        <!-- 协议内容卡片 -->
        <view class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <view class="p-5 sm:p-6">
            <!-- 标题 -->
            <view class="text-2xl font-bold text-gray-900 dark:text-white mb-6">用户协议</view>

            <!-- 协议内容 -->
            <view class="space-y-4 text-gray-700 dark:text-gray-300">
              <!-- 欢迎段落 -->
              <view class="text-base">欢迎使用课程表助手小程序！</view>
              <view class="text-base">
                本协议是您与课程表助手小程序之间关于使用本服务所订立的协议。使用本服务前，请您仔细阅读以下条款。
              </view>

              <!-- 第一部分：服务说明 -->
              <view class="mt-6">
                <view class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  1. 服务说明
                </view>
                <view class="text-base">
                  本小程序提供课程表查询、考试信息查询、成绩查询等教务信息服务。我们致力于为您提供便捷、高效的校园信息获取体验。
                </view>
              </view>

              <!-- 第二部分：用户信息 -->
              <view class="mt-4">
                <view class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  2. 用户信息与隐私保护
                </view>
                <view class="text-base">
                  我们高度重视您的隐私保护，会严格保护您的个人信息安全。未经您的同意，我们不会向第三方披露您的个人信息。您的教务系统账号和密码仅用于登录教务系统获取信息，不会被用于其他用途。
                </view>
                <view class="text-base mt-2">
                  我们采取业界标准的安全措施保护您的个人信息，防止未经授权的访问、使用或泄露。
                </view>
              </view>

              <!-- 第三部分：服务变更 -->
              <view class="mt-4">
                <view class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  3. 服务变更
                </view>
                <view class="text-base">
                  我们保留随时修改或中断服务而不需通知您的权利。我们不保证服务一定能满足您的要求，也不保证服务不会中断。
                </view>
              </view>

              <!-- 第四部分：用户行为规范 -->
              <view class="mt-4">
                <view class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  4. 用户行为规范
                </view>
                <view class="text-base">
                  您在使用本服务时应遵守中华人民共和国相关法律法规，不得利用本服务从事违法违规活动。您不得利用本服务进行任何可能对互联网正常运转造成不利影响的行为。
                </view>
                <view class="text-base mt-2">
                  您不得利用本服务传播任何骚扰性、中伤他人、辱骂性、恐吓性、庸俗或其他任何非法的信息资料。
                </view>
              </view>

              <!-- 第五部分：知识产权 -->
              <view class="mt-4">
                <view class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  5. 知识产权
                </view>
                <view class="text-base">
                  本小程序的所有权、运营权和知识产权归开发者所有。本小程序代码采用GNU通用公共许可证(GPL)开源，这意味着：
                </view>
                <view class="text-base mt-2 pl-4">
                  <view class="flex items-start mb-1">
                    <view class="text-primary-500 mr-2">•</view>
                    <view>您可以自由地使用、修改和分发本程序的源代码</view>
                  </view>
                  <view class="flex items-start mb-1">
                    <view class="text-primary-500 mr-2">•</view>
                    <view>如果您分发修改后的版本，必须同样以GPL协议开源</view>
                  </view>
                  <view class="flex items-start mb-1">
                    <view class="text-primary-500 mr-2">•</view>
                    <view>您必须在显著位置注明原作者信息和对原始代码的修改</view>
                  </view>
                  <view class="flex items-start mb-1">
                    <view class="text-primary-500 mr-2">•</view>
                    <view>不允许将本程序用于商业目的，除非获得原作者的明确授权</view>
                  </view>
                </view>
                <view class="text-base mt-2">
                  详细的许可条款请参阅GNU GPL v3许可证。使用本小程序即表示您同意遵守上述协议条款。
                </view>
              </view>

              <!-- 第六部分：免责声明 -->
              <view class="mt-4">
                <view class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  6. 免责声明
                </view>
                <view class="text-base">
                  本小程序显示的信息来源于学校教务系统，我们不对信息的准确性、完整性负责。因网络问题、系统维护等原因导致的服务中断，我们不承担责任。
                </view>
              </view>

              <!-- 第七部分：协议修改 -->
              <view class="mt-4">
                <view class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  7. 协议修改
                </view>
                <view class="text-base">
                  我们保留随时修改本协议的权利，修改后的协议条款将在小程序内公布。如您继续使用本服务，则视为您已接受修改后的协议。
                </view>
              </view>

              <!-- 结束语 -->
              <view class="mt-6 text-base">
                感谢您使用课程表助手小程序，我们将竭诚为您提供优质服务！
              </view>
            </view>
          </view>
        </view>

        <!-- 底部版权信息 -->
        <view class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          © {{ currentYear }} wakeNUC 版权所有
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import CustomNavBar from '@/components/CustomNavBar.vue'
import { getWindowInfoSafe } from '@/utils/system'

// 状态栏高度
const statusBarHeight = ref(20)

// 计算当前年份用于版权信息
const currentYear = computed(() => new Date().getFullYear())

/**
 * 处理返回按钮点击事件
 * 尝试返回上一页，如果失败则跳转到关于页面
 */
function handleBack() {
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

<!-- 不再需要单独的style标签，所有样式都通过Tailwind类名实现 -->
