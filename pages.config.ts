import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationBarBackgroundColor: '#f8f8f8',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
        'z-paging/components/z-paging$1/z-paging$1.vue',
    },
  },
  pages: [
    {
      path: 'pages/index/index',
      type: 'home',
      style: {
        navigationStyle: 'custom',
        navigationBarTitleText: '首页',
        enablePullDownRefresh: true,
        backgroundTextStyle: 'dark',
      },
    },
    {
      path: 'pages/about/about',
      type: 'page',
      style: {
        navigationStyle: 'custom',
        navigationBarTitleText: '关于',
      },
    },
    {
      path: 'pages/about/components/AcademicInfo',
      style: {
        navigationBarTitleText: '学业信息',
        enablePullDownRefresh: true,
        backgroundTextStyle: 'dark',
        navigationStyle: 'custom',
      },
    },
    {
      path: 'pages/about/components/GradeInfo',
      style: {
        navigationBarTitleText: '我的成绩',
        navigationStyle: 'custom',
      },
    },
    {
      path: 'pages/about/components/ClassroomInfo',
      style: {
        navigationBarTitleText: '空闲教室',
        navigationStyle: 'custom',
      },
    },
    {
      path: 'pages/about/components/ExamInfo',
      style: {
        navigationBarTitleText: '考试信息',
        navigationStyle: 'custom',
      },
    },
    {
      path: 'pages/about/components/Agreement',
      style: {
        navigationBarTitleText: '用户协议',
        navigationStyle: 'custom',
      },
    },
    {
      path: 'pages/about/components/OpenSource',
      style: {
        navigationBarTitleText: '开源说明',
        navigationStyle: 'custom',
      },
    },
    {
      path: 'pages/about/components/Version',
      style: {
        navigationBarTitleText: '版本信息',
        navigationStyle: 'custom',
      },
    },
  ],
})
