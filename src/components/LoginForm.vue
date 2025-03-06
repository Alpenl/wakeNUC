<template>
  <view class="login-container">
    <!-- Logo和标题区域 -->
    <view class="logo-container">
      <text class="title">wakeNUC</text>
      <text class="subtitle">校园生活智能助手</text>
    </view>

    <!-- 用户名输入框 -->
    <view class="input-container">
      <view :class="['input-group', isUsernameFocused ? 'input-focused' : '']">
        <input
          v-model="username"
          type="text"
          placeholder="请输入学号或教务系统账号"
          class="input-field"
          @focus="isUsernameFocused = true"
          @blur="isUsernameFocused = false"
        />
      </view>
      <view v-if="usernameError" class="error-text">
        <text class="iconfont icon-warning"></text>
        <text>{{ usernameError }}</text>
      </view>
    </view>

    <!-- 密码输入框 -->
    <view class="input-container">
      <view :class="['input-group', isPasswordFocused ? 'input-focused' : '']">
        <input
          v-model="password"
          :password="!showPassword"
          placeholder="请输入教务系统密码"
          class="input-field"
          @focus="isPasswordFocused = true"
          @blur="isPasswordFocused = false"
        />
      </view>
      <view v-if="passwordError" class="error-text">
        <text class="iconfont icon-warning"></text>
        <text>{{ passwordError }}</text>
      </view>
    </view>

    <!-- 用户协议 -->
    <view class="agreement-group">
      <checkbox
        :checked="isAgreeProtocol"
        @tap="toggleAgreeProtocol"
        color="#6c63ff"
        style="transform: scale(0.7)"
      />
      <text class="agreement-text">我已阅读并同意</text>
      <text class="agreement-link" @click.stop="navigateToAgreement">《用户协议》</text>
    </view>

    <!-- 登录按钮 -->
    <button
      @click="handleLogin"
      :disabled="!isFormValid || isLoading"
      :class="['login-button', isFormValid ? 'button-active' : 'button-inactive']"
    >
      <!-- <text v-if="isLoading" class="iconfont icon-loading loading-icon"></text> -->
      <text>{{ isLoading ? '登录中...' : '登录' }}</text>
    </button>

    <!-- 底部信息 -->
    <view class="footer">
      <text class="copyright">© {{ currentYear }} wakeNUC</text>
      <text class="slogan">便捷校园生活，尽在掌握</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import userService from '@/request/api/user'
import { useTimeStore } from '@/store/timeStore'

// 初始化 store
const timeStore = useTimeStore()

// 表单数据
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const isAgreeProtocol = ref(false)
const usernameError = ref('')
const passwordError = ref('')

// 输入框焦点状态
const isUsernameFocused = ref(false)
const isPasswordFocused = ref(false)

// 计算当前年份
const currentYear = computed(() => new Date().getFullYear())

// 计算表单是否有效
const isFormValid = computed(() => {
  return username.value.trim() !== '' && password.value.trim() !== '' && isAgreeProtocol.value
})

// 定义事件
const emit = defineEmits(['login-success'])

// 切换密码可见性
function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

// 切换同意协议状态
function toggleAgreeProtocol() {
  isAgreeProtocol.value = !isAgreeProtocol.value
}

// 显示消息提示
function showMessage(message: string, type: 'success' | 'error' | 'warn' | 'info' = 'success') {
  uni.showToast({
    title: message,
    icon: type === 'success' ? 'success' : 'none',
    duration: 2000,
  })
}

// 跳转到用户协议页面
function navigateToAgreement() {
  uni.navigateTo({
    url: '/pages/about/components/Agreement',
    fail: (err) => {
      console.error('跳转到用户协议页面失败:', err)
      showMessage('页面跳转失败', 'error')
    },
  })
}

// 处理登录
async function handleLogin() {
  // 重置错误信息
  usernameError.value = ''
  passwordError.value = ''

  // 表单验证
  let isValid = true

  if (!username.value) {
    usernameError.value = '请输入账号'
    isValid = false
  }

  if (!password.value) {
    passwordError.value = '请输入密码'
    isValid = false
  }

  if (!isAgreeProtocol.value) {
    showMessage('请先同意用户协议', 'error')
    isValid = false
  }

  if (!isValid) return

  // 显示加载状态
  isLoading.value = true

  try {
    // 调用登录服务
    const { loginInfo } = await userService
      .login({
        name: username.value,
        passwd: password.value,
      })
      .catch((error) => {
        // 登录失败，立即抛出错误
        isLoading.value = false
        throw error
      })

    // 登录成功后获取课表
    try {
      // 获取课表
      const courses = await userService.getTimetable({
        name: loginInfo.username,
        passwd: loginInfo.password,
      })

      // 更新课表数据
      timeStore.setCourseList(courses)

      // 显示成功提示
      showMessage('登录成功，课表已更新', 'success')

      // 跳转到首页
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/index/index',
        })
      }, 1500)
    } catch (error) {
      console.error('获取课表失败:', error)
      showMessage('登录成功，但获取课表失败', 'warn')
      // 即使获取课表失败，也允许用户继续使用
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/index/index',
        })
      }, 1500)
    }
  } catch (error) {
    console.error('登录失败:', error)
    showMessage(error.message || '登录失败，请检查账号密码', 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
/* 页面基础样式 */
page {
  height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
}
/* 图标字体 */
@font-face {
  font-family: 'iconfont';
  src: url('dat':font/wo'f2;charset=utf-8;base64,d09GMgABAAAAAAO0AAsAAAAACFwAAANlAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqDaIM0ATYCJAMUCwwABCAFhGcHSBswBxEVnPHIfiZkp0rDS2XoHlFpgkPz4xnkCQAAAAAQPPy3X7tvZr7omySaTSaJJ/FEIpFJmja0QiGRTCeRKP3/e9p8oCxYPqCcZo/GY9IHTYADHOChbmCj/f9cZl+kWEJ+m89lLKrQKI3HaUADiqgX5O78QO6E/zBeuoRjeJoAk3xykevHL1+jV8C0QNwVjEavBVcUZqGHrq1hbBbxBh096VV6BV7776MfZqJHUjMwc+/5sSkY/Cz9bEFa/V+dMAWI4Wwg20jYBhTiUaPnABMYt2GS+v3KHmCSHklfpZ+Nnw/4/+dYOYGJ/vWyRGZQNcBOBpqYUJXIZwlIfpZCop9VkPjZgrSFVQMmYAdewFcYL5DCrtiRI8G+ffNEYmKH2Lh1+9atEVu2jCLWbVi/fv2mTRs2hG/aFLF1a+TmzZu3bYvati1i+/bIHTt27twZtXNnxK5dkbt3R+3ZE7V3b9S+fVH790cdOBB98GDMoUMxhw/HHDkSe/Ro7LFjscePx504EXfyZNzp03FnzsSfPRt/7lz8+fPxFy4kXLyYcOlSwuXLiVeuJF69mnTtWtL168k3biTfvJly61bK7dspt2+n3rmTevdu6r17qffvpz54kPbwYdrjx2lPnqQ9fZr27Fna8+fpL16kv3yZ/upV+uvXGW/eZLx9m/HuXcb79xkfPmR8/Jj56VPm588ZX75kfv2a+e1b5vfvmT9+ZP78mfXrV9bv31l//mT9/Zv1719WIkQCkLWVTQOQ9YNNAyA7wKYRyN7GphHI2c6mAcjdwaYRyNvJpgHI/8mmESj4xaYBKPzNpgEo+sOmESj+y6YBKPnHpgEo/c+mASgDkLWNTQOQvZ1NA5Czg00DkLuTTSOQt4tNA5C/m00DUPCLTQNQ+JtNA1D0h00jUPyXTQNQ8o9NA1D6n00DUAYgexubBiBnO5sGIHcHm0Ygbxcb1f8BWVvZNADZO9g0ADk72TQCebvZNAD5e9g0AAV/2DQAhX/ZNABFf9k0AsX/2DQAJf/ZNABZ29k0ADk72DQAuTvZNAJ5u9moAeAHAGQSSdNQk0gKGmryP4JKZWP3/9cEgwMAn6byo36B/8zPBvyzx7Oq3/FvqgIA/K/6SQsA/O/6yYIBgIRdVS2bWl5arWj3VksmmeSJQQ99Q/D3TwwwKQpIemxA1rOCLNhtqOnbhrbeFkz2Gd2/ZxqFSGHLBmDNMYBk1RtIlr1BFuwXaDb9QdtqJJicR+mWPTMHl0KRwkQoFKgLjY2ieVSUI4xQVcSch6IoURTlKOcQSkqKiKpEOQqjnOAox+GoKCoqijhHOIJQjiAoFI0gKKc4h6McQTkcxTkKxQUUjXIwFAXqBBobCeNRojgEQ1AlxPiJhUJi9SnkcSgSJZJEqJQQjkJRHIFDcRwcKiQqVEjE4ZwjMAgOgaAQaQgE5VIcDkdxBOJwKJxFQeICFBqKg0JTCusVt7cA5n9MgYQUOXIUqNAw+lCOQlGhQlKhHMWgKJTDCQA=')
    format('woff2');
}

.iconfont {
  font-family: 'iconfont' !important;
  font-size: 32rpx;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-user:before {
  content: '\e7ae';
}

.icon-lock:before {
  content: '\e7c9';
}

.icon-eye:before {
  content: '\e78f';
}

.icon-eye-close:before {
  content: '\e8ff';
}

.icon-warning:before {
  content: '\e73d';
}

.icon-loading:before {
  content: '\e644';
}
/* 登录容器 */
.login-container {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 650rpx;
  padding: 70rpx 50rpx;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 30rpx;
  box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.08);
  transform: translate(-50%, -50%);
}
/* Logo和标题区域 */
.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
}

.title {
  margin-bottom: 10rpx;
  font-size: 56rpx;
  font-weight: 700;
  color: #333;
  text-align: center;
  letter-spacing: 2rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #888;
  text-align: center;
}
/* 输入框容器 */
.input-container {
  margin-bottom: 30rpx;
}

.input-group {
  display: flex;
  align-items: center;
  padding: 24rpx 30rpx;
  margin-bottom: 10rpx;
  background-color: #f8f9fa;
  border: 2rpx solid transparent;
  border-radius: 16rpx;
  transition: all 0.3s ease;
}

.input-focused {
  background-color: rgba(108, 99, 255, 0.05);
  border-color: #6c63ff;
  box-shadow: 0 0 0 2rpx rgba(108, 99, 255, 0.1);
}

.input-icon {
  margin-right: 20rpx;
  color: #999;
}

.input-field {
  flex: 1;
  height: 48rpx;
  font-size: 30rpx;
  color: #333;
}

.password-toggle {
  color: #999;
}
/* 错误提示 */
.error-text {
  display: flex;
  align-items: center;
  padding-left: 20rpx;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #ff6b6b;
}

.error-text .iconfont {
  margin-right: 10rpx;
  font-size: 24rpx;
}
/* 忘记密码 */
.forgot-password {
  display: none; /* 隐藏忘记密码选项 */
  margin-bottom: 30rpx;
  text-align: right;
}

.forgot-password text {
  font-size: 26rpx;
  color: #6c63ff;
}
/* 用户协议 */
.agreement-group {
  display: flex;
  align-items: center;
  margin: 40rpx 0;
}

.agreement-text {
  font-size: 26rpx;
  color: #666;
}

.agreement-link {
  font-size: 26rpx;
  color: #6c63ff;
}
/* 登录按钮 */
.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
  height: 90rpx;
  margin: 0 auto 30rpx;
  font-size: 32rpx;
  font-weight: 500;
  color: #fff;
  text-align: center;
  background-color: #cccccc;
  border-radius: 45rpx;
  box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.button-active {
  background: linear-gradient(135deg, #7367f0 0%, #6c63ff 100%);
  box-shadow: 0 10rpx 20rpx rgba(108, 99, 255, 0.3);
}

.button-inactive {
  background-color: #cccccc;
}

.loading-icon {
  margin-right: 10rpx;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
/* 底部信息 */
.footer {
  margin-top: 60rpx;
  text-align: center;
}

.copyright {
  display: block;
  margin-bottom: 8rpx;
  font-size: 24rpx;
  color: #999;
}

.slogan {
  font-size: 22rpx;
  color: #bbb;
}
</style>
