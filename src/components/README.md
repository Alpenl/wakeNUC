# 组件文档

## CustomNavBar 自定义导航栏组件

### 简介

`CustomNavBar` 是一个基于 Tailwind CSS 开发的自定义导航栏组件，用于替代原生导航栏，提供统一的视觉风格和交互体验。该组件遵循 Unibest 框架规范，支持自定义标题、返回按钮和右侧操作区域。

### 使用方法

```vue
<template>
  <view>
    <custom-nav-bar title="页面标题" @back="handleBack">
      <!-- 可选：自定义右侧内容 -->
      <template #right>
        <text class="text-white">自定义内容</text>
      </template>
    </custom-nav-bar>

    <!-- 页面内容 -->
    <view :style="{ paddingTop: `calc(${statusBarHeight}px + 44px)` }">页面内容</view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CustomNavBar from '@/components/CustomNavBar.vue'

// 状态栏高度
const statusBarHeight = ref(20)

// 处理返回按钮点击
const handleBack = () => {
  uni.navigateBack({ delta: 1 })
}

// 获取系统信息
onMounted(() => {
  try {
    const systemInfo = uni.getSystemInfoSync()
    statusBarHeight.value = systemInfo.statusBarHeight || 20
  } catch (error) {
    console.error('获取系统信息失败:', error)
  }
})
</script>
```

### 属性

| 属性名   | 类型    | 默认值 | 说明                     |
| -------- | ------- | ------ | ------------------------ |
| title    | String  | -      | 导航栏标题（必填）       |
| showBack | Boolean | true   | 是否显示返回按钮         |
| delta    | Number  | 1      | 返回按钮点击时的回退层级 |

### 插槽

| 插槽名 | 说明                                 |
| ------ | ------------------------------------ |
| right  | 导航栏右侧内容，默认显示点和圆圈图标 |

### 事件

| 事件名 | 说明               |
| ------ | ------------------ |
| back   | 返回按钮点击时触发 |

### 注意事项

1. 使用自定义导航栏时，需要在页面的 `<route>` 块中设置 `navigationStyle: 'custom'`
2. 页面内容需要添加上边距，避免被导航栏遮挡
3. 组件内部已处理状态栏高度适配，无需额外处理

### 样式定制

组件使用 Tailwind CSS 类进行样式定义，可以通过以下方式进行样式定制：

1. 修改组件内的 Tailwind 类
2. 使用全局 CSS 变量覆盖默认样式
3. 在使用组件的页面中添加自定义样式
