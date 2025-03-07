/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by vite-plugin-uni-pages

interface NavigateToOptions {
  url: "/pages/index/index" |
       "/pages/about/about" |
       "/pages/about/components/AcademicInfo" |
       "/pages/about/components/GradeInfo" |
       "/pages/about/components/ClassroomInfo" |
       "/pages/about/components/ExamInfo" |
       "/pages/about/components/Agreement" |
       "/pages/about/components/OpenSource" |
       "/pages/about/components/Version";
}
interface RedirectToOptions extends NavigateToOptions {}

interface SwitchTabOptions {
  
}

type ReLaunchOptions = NavigateToOptions | SwitchTabOptions;

declare interface Uni {
  navigateTo(options: UniNamespace.NavigateToOptions & NavigateToOptions): void;
  redirectTo(options: UniNamespace.RedirectToOptions & RedirectToOptions): void;
  switchTab(options: UniNamespace.SwitchTabOptions & SwitchTabOptions): void;
  reLaunch(options: UniNamespace.ReLaunchOptions & ReLaunchOptions): void;
}
