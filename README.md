# WakeNUC

基于 uni-app 和 Vue 3 的跨平台应用开发模板，支持多端开发。

## 项目特点

- 🚀 基于 Vue 3、Vite、TypeScript、uni-app
- 📱 支持多端开发（H5、小程序、App）
- 🎨 集成 UnoCSS 原子化 CSS
- 📦 使用 pnpm 包管理器
- 🔍 ESLint + Prettier + Stylelint 代码规范
- 🌟 自动导入 API
- 🔄 状态管理：Pinia
- 📝 Git Commit 规范化
- 🎯 Vue Query 数据请求管理
- 🎁 Wot Design Uni UI 组件库

## 技术栈

- 核心框架：Vue 3.4.x + TypeScript
- 构建工具：Vite 5.x
- UI 框架：Wot Design Uni
- 状态管理：Pinia
- 数据请求：Vue Query
- CSS 框架：UnoCSS
- 代码规范：ESLint + Prettier + Stylelint
- Git 规范：Husky + Commitlint

## 开发环境要求

- Node.js >= 18
- pnpm >= 7.30

## 快速开始

```bash
# 安装依赖
pnpm install

# 开发
# H5
pnpm dev:h5

# 微信小程序
pnpm dev:mp-weixin

# App
pnpm dev:app

# 打包
# H5
pnpm build:h5

# 微信小程序
pnpm build:mp-weixin

# App
pnpm build:app
```

## 项目结构

```
├── src/
│   ├── components/     # 公共组件
│   ├── pages/         # 页面
│   ├── store/         # Pinia 状态管理
│   ├── service/       # 服务层
│   ├── utils/         # 工具函数
│   ├── hooks/         # 组合式函数
│   ├── static/        # 静态资源
│   ├── style/         # 全局样式
│   ├── types/         # 类型定义
│   └── App.vue        # 入口组件
├── vite.config.ts     # Vite 配置
├── uno.config.ts      # UnoCSS 配置
├── tsconfig.json      # TypeScript 配置
└── package.json       # 项目配置
```

## 代码规范

项目集成了以下代码规范工具：

- ESLint：JavaScript/TypeScript 代码检查
- Prettier：代码格式化
- Stylelint：CSS/SCSS 代码检查
- Commitlint：Git 提交信息规范

## 支持平台

- H5
- 微信小程序
- 支付宝小程序
- 百度小程序
- 字节跳动小程序
- QQ小程序
- 快手小程序
- 飞书小程序
- App（Android/iOS）

## 开发规范

请参考以下规范进行开发：

- 遵循 Vue 3 组合式 API 风格
- 使用 TypeScript 编写代码
- 遵循 ESLint 和 Prettier 配置的代码风格
- 遵循 Git Commit 规范

## 许可证

[MIT](LICENSE)
